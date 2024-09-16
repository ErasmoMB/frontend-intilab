# Guía para ejecutar el Frontend en el Servidor

# Ejecutar tu aplicación frontend en tu servidor utilizando `pm2` y `serve`

## Requisitos Previos

- Node.js y npm instalados en tu servidor.
- Acceso SSH al servidor.
- Conocimientos básicos de línea de comandos.

## Paso 1: Preparar el Proyecto

1. **Clonar o Copiar el Proyecto:**
   Asegúrate de tener el código fuente del frontend en tu servidor. Puedes clonarlo desde un repositorio remoto o copiar los archivos manualmente.

2. **Instalar Dependencias:**
   Si aún no lo has hecho, instala `serve` globalmente para poder usarlo desde cualquier directorio:
   ```bash
   npm install -g serve
   ```

## Compilar el Proyecto

Si tu proyecto frontend necesita ser compilado (por ejemplo, si estás usando React), asegúrate de compilarlo antes de servirlo:

```bash
npm install   # Instala las dependencias del proyecto
npm run build # Compila el proyecto para producción
```

## Paso 2: Iniciar la Aplicación con pm2

Instalar pm2 (si no está instalado):

```bash
npm install -g pm2
```

Iniciar la Aplicación:

Utiliza pm2 para iniciar tu aplicación frontend. Asegúrate de especificar el puerto deseado (por ejemplo, puerto 3334):

```bash
pm2 start "serve -s build -l 3334" --name my_frontend_app
```

- `serve -s build -l 3334`: Comando para servir la aplicación estática desde la carpeta build en el puerto 3334.
- `--name my_frontend_app`: Nombre que le das al proceso en pm2.

## Paso 3: Verificar el Estado y los Logs

Verificar el Estado de la Aplicación:

Puedes verificar que tu aplicación está corriendo correctamente con:

```bash
pm2 status
```

Ver los Logs de la Aplicación:

Para revisar los logs de tu aplicación en tiempo real:

```bash
pm2 logs my_frontend_app
```

## Paso 4: Acceder a tu Aplicación

Una vez que tu aplicación esté ejecutándose en el servidor, puedes acceder a ella desde un navegador utilizando la dirección IP o el dominio del servidor y el puerto especificado.

- [http://mi-direccion-ip:3334/](http://mi-direccion-ip:3334/)
