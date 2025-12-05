# ============================================
# SISTEMA DE REGISTRO DE EQUIPOS
# ============================================
# Backend Flask con conexión a MySQL AWS RDS
# Proporciona endpoints REST para operaciones CRUD
# ============================================

from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
import os

app = Flask(__name__)

# ============================================
# CONFIGURACIÓN DE BASE DE DATOS
# ============================================
# Conexión directa a AWS RDS MySQL
app.config['MYSQL_HOST'] = 'h251s2.c506266wsgbx.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'diego1416'
app.config['MYSQL_DB'] = 'hackaton'
app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'

mysql = MySQL(app)

def ejecutar_query(query, params=None, uno=False):
    """Función auxiliar para ejecutar consultas SQL de forma segura"""
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(query, params or ())
    resultado = cursor.fetchone() if uno else cursor.fetchall()
    cursor.close()
    return resultado

# ============================================
# RUTAS DE VISTAS (TEMPLATES)
# ============================================

@app.route('/')
def index():
    """Renderiza el formulario de registro de equipos"""
    return render_template("index.html")

@app.route('/equipos')
def equipos():
    """Renderiza la lista de equipos registrados"""
    return render_template("equipos.html")

# ============================================
# ENDPOINTS REST API
# ============================================

@app.route('/api/equipos', methods=['GET'])
def listar_equipos():
    """
    GET /api/equipos - Obtiene todos los equipos registrados
    Returns: JSON con lista de equipos ordenados por fecha de registro
    """
    try:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM equipos ORDER BY fecha_registro DESC")
        equipos = cursor.fetchall()
        cursor.close()
        return jsonify({'ok': True, 'equipos': equipos}), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'ok': False, 'error': str(e)}), 500

@app.route('/api/equipos', methods=['POST'])
def crear_equipo():
    """
    POST /api/equipos - Registra un nuevo equipo
    Body: JSON con datos del equipo (codigo, tipo, marcas, modelo, so, almacenamiento, ram, estado, mantenimiento)
    Returns: JSON con confirmación de registro exitoso
    """
    try:
        datos = request.get_json()
        if not datos:
            return jsonify({'ok': False, 'error': 'No hay datos'}), 400
        
        # Insertar nuevo equipo usando consulta parametrizada (seguridad SQL injection)
        cursor = mysql.connection.cursor()
        sql = """INSERT INTO equipos 
                 (codigo, tipo, marcas, modelo, so, almacenamiento, ram, estado, mantenimiento) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        
        valores = (
            datos.get('codigo'),
            datos.get('tipo'),
            datos.get('marcas'),
            datos.get('modelo'),
            datos.get('so'),
            datos.get('almacenamiento'),
            datos.get('ram'),
            datos.get('estado'),
            datos.get('mantenimiento')
        )
        
        cursor.execute(sql, valores)
        mysql.connection.commit()
        cursor.close()
        
        return jsonify({'ok': True, 'mensaje': 'Equipo registrado exitosamente'}), 200
        
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        try:
            mysql.connection.rollback()
        except:
            pass
        return jsonify({'ok': False, 'error': str(e)}), 500

@app.route('/api/equipos/<int:id>', methods=['PUT'])
def actualizar_equipo(id):
    """
    PUT /api/equipos/<id> - Actualiza un equipo existente
    Params: id del equipo a actualizar
    Body: JSON con datos actualizados del equipo
    Returns: JSON con confirmación de actualización exitosa
    """
    try:
        datos = request.get_json()
        if not datos:
            return jsonify({'ok': False, 'error': 'No hay datos'}), 400
        
        # Actualizar equipo usando consulta parametrizada
        cursor = mysql.connection.cursor()
        sql = """UPDATE equipos SET 
                 codigo=%s, tipo=%s, marcas=%s, modelo=%s, so=%s, 
                 almacenamiento=%s, ram=%s, estado=%s, mantenimiento=%s 
                 WHERE id=%s"""
        
        valores = (
            datos.get('codigo'),
            datos.get('tipo'),
            datos.get('marcas'),
            datos.get('modelo'),
            datos.get('so'),
            datos.get('almacenamiento'),
            datos.get('ram'),
            datos.get('estado'),
            datos.get('mantenimiento'),
            id
        )
        
        cursor.execute(sql, valores)
        mysql.connection.commit()
        cursor.close()
        
        return jsonify({'ok': True, 'mensaje': 'Equipo actualizado exitosamente'}), 200
        
    except MySQLdb.Error as e:
        import traceback
        print(f"Error MySQL: {str(e)}")
        print(traceback.format_exc())
        try:
            mysql.connection.rollback()
        except MySQLdb.Error:
            pass
        return jsonify({'ok': False, 'error': 'Error en la base de datos'}), 500
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        return jsonify({'ok': False, 'error': 'Error del servidor'}), 500

@app.route('/api/equipos/<int:id>', methods=['DELETE'])
def eliminar_equipo(id):
    """
    DELETE /api/equipos/<id> - Elimina un equipo
    Params: id del equipo a eliminar
    Returns: JSON con confirmación de eliminación exitosa
    """
    try:
        # Eliminar equipo de la base de datos
        cursor = mysql.connection.cursor()
        cursor.execute("DELETE FROM equipos WHERE id=%s", (id,))
        mysql.connection.commit()
        cursor.close()
        
        return jsonify({'ok': True, 'mensaje': 'Equipo eliminado exitosamente'}), 200
        
    except MySQLdb.Error as e:
        import traceback
        print(f"Error MySQL: {str(e)}")
        print(traceback.format_exc())
        try:
            mysql.connection.rollback()
        except MySQLdb.Error:
            pass
        return jsonify({'ok': False, 'error': 'Error en la base de datos'}), 500
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        return jsonify({'ok': False, 'error': 'Error del servidor'}), 500

if __name__ == '__main__':
    puerto = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=puerto, debug=True)