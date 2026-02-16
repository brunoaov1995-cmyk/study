// Flashcards Data - COMPLETO con 60 cards
const flashcardsData = [
    {
        id: 1,
        category: "backend",
        question: "¿Cuál era el propósito principal del sistema de control para invernaderos?",
        answer: "Monitorear datos de sensores físicos como temperatura, humedad y CO₂ para almacenarlos y permitir su consulta centralizada.",
        codeExample: `// Sistema de invernaderos en acción
public class ReadingDto {
    public int SensorId { get; set; }
    public double Temperature { get; set; }  // °C
    public double Humidity { get; set; }     // %
    public double CO2 { get; set; }          // ppm
    public DateTime Timestamp { get; set; }
}

// Los sensores enviaban datos cada 5 minutos
// 50 sensores × 288 lecturas/día = 14,400 registros diarios`,
        simpleExplanation: "🌱 Piensa en el sistema como un doctor que monitorea pacientes (los cultivos). Cada sensor es como un termómetro que toma las 'señales vitales' del invernadero.\n\n📊 Así como en un hospital el personal ve el historial de temperatura de un paciente para detectar fiebre, aquí los técnicos ven si la temperatura del invernadero está muy alta y está afectando las plantas.\n\n🎯 En el proyecto: 50 sensores enviaban datos cada 5 minutos = 14,400 lecturas diarias que guardábamos."
    },
    {
        id: 2,
        category: "backend",
        question: "¿Cuáles eran las tres capas principales del sistema de monitoreo de invernaderos?",
        answer: "Una capa IoT de recolección de datos, una capa backend de procesamiento y una capa de visualización para los usuarios.",
        codeExample: `// Arquitectura del sistema

┌──────────────────┐
│   CAPA IoT       │  Sensores en México
│   (Hardware)     │  envían datos cada 5 min
└────────┬─────────┘
         ↓ HTTP POST
┌──────────────────┐
│  CAPA BACKEND    │  API en .NET Core (Bolivia)
│  (ASP.NET Core)  │  recibe, valida, almacena
└────────┬─────────┘
         ↓ REST API
┌──────────────────┐
│ CAPA WEB/MOBILE  │  Dashboard Angular
│ (Visualización)  │  técnicos consultan
└──────────────────┘`,
        simpleExplanation: "🏭 Es como una fábrica con 3 departamentos que no se mezclan:\n\n1️⃣ **Recolección (IoT)**: Los sensores en México son como vigilantes que anotan todo lo que pasa en el invernadero.\n\n2️⃣ **Procesamiento (Backend)**: Nosotros en Bolivia somos como la oficina central que recibe los reportes, los revisa y los archiva.\n\n3️⃣ **Visualización (Web)**: El dashboard es como el escritorio del jefe que solo ve resúmenes bonitos, no necesita ir al invernadero."
    },
    {
        id: 3,
        category: "backend",
        question: "¿Por qué es desaconsejable incluir la lógica de negocio y el acceso a datos directamente en el Controller?",
        answer: "Porque mezcla responsabilidades y hace que el código sea extremadamente difícil de mantener ante cambios en reglas o bases de datos.",
        codeExample: `// ❌ MALO: Todo revuelto
[HttpPost]
public IActionResult Create(SensorDto dto) {
    if (string.IsNullOrEmpty(dto.Name)) return BadRequest();
    if (_context.Sensors.Any(s => s.Name == dto.Name)) 
        return Conflict();
    _context.Sensors.Add(new Sensor { Name = dto.Name });
    _context.SaveChanges();
    // Si cambia BD: toca TODO
}

// ✅ BUENO: Separado
[HttpPost]
public async Task<IActionResult> Create(SensorDto dto) {
    var result = await _service.CreateAsync(dto);
    return Ok(result);
}`,
        simpleExplanation: "🍝 Hacer todo en el Controller es como cocinar pasta y salsa en la misma olla:\n\n❌ **Malo**: Si la salsa se quema, botas TODO.\n✅ **Bueno**: Pasta en una olla, salsa en otra. Si la salsa falla, solo rehaces la salsa.\n\n🎯 En el proyecto: Cuando cambiamos validaciones de sensores, solo tocamos el Service. El Controller ni se enteró."
    },
    {
        id: 4,
        category: "backend",
        question: "En una arquitectura por capas, ¿cuál es la responsabilidad exclusiva del Controller?",
        answer: "Recibir la petición HTTP, validar el formato básico del modelo y devolver la respuesta al cliente.",
        codeExample: `// Controller = Recepcionista
[ApiController]
[Route("api/[controller]")]
public class SensorsController : ControllerBase {
    private readonly ISensorService _service;
    
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id) {
        var sensor = await _service.GetByIdAsync(id);
        if (sensor == null) return NotFound();
        return Ok(sensor);
    }
    
    // NO hace: lógica, SQL, cálculos
}`,
        simpleExplanation: "🏨 El Controller es el recepcionista del hotel:\n\n✅ Recibe clientes (peticiones HTTP)\n✅ Llama al departamento correcto (Service)\n✅ Entrega la respuesta\n\n❌ NO limpia habitaciones (lógica)\n❌ NO maneja inventario (base de datos)\n\n🎯 Real: Cuando el frontend pedía lecturas, el Controller solo coordinaba. El Service decidía qué datos enviar."
    },
    {
        id: 5,
        category: "backend",
        question: "¿Qué tipo de lógica debe residir específicamente en la capa de Service?",
        answer: "La lógica de negocio pura, como determinar si un sensor está fuera de rango o gestionar registros duplicados.",
        codeExample: `// Service = Cerebro (reglas de negocio)
public async Task<Alert> ProcessReading(Reading r) {
    // Regla: ¿Temperatura crítica?
    if (r.Temperature < 15 || r.Temperature > 35) {
        return new Alert {
            Type = "CRITICAL",
            Message = "¡Temperatura anormal!"
        };
    }
    
    // Regla: ¿Humedad baja?
    if (r.Humidity < 40) {
        return new Alert {
            Type = "WARNING",
            Message = "Activar riego"
        };
    }
    
    return null; // Todo OK
}`,
        simpleExplanation: "🧠 El Service es el agrónomo experto que conoce las reglas:\n\n\"Si temperatura > 35°C → Abrir ventanas\"\n\"Si humedad < 40% → Activar riego\"\n\"Si CO₂ bajo → Revisar ventilación\"\n\n🎯 Real: Cuando llegaba una lectura de 38°C, el Service decidía: \"¡Alerta! Temperatura crítica\". El Controller solo recibía el dato, el Service pensaba."
    },
    {
        id: 6,
        category: "backend",
        question: "¿Cuál es la única función que debe cumplir la capa de Repository?",
        answer: "Encargarse exclusivamente de la comunicación y las operaciones de lectura o escritura con la base de datos.",
        codeExample: `// Repository = Bibliotecario (solo guarda/busca)
public class SensorRepository {
    private readonly AppDbContext _context;
    
    public async Task<Sensor> GetByIdAsync(int id) {
        return await _context.Sensors.FindAsync(id);
    }
    
    public async Task AddAsync(Sensor sensor) {
        _context.Sensors.Add(sensor);
        await _context.SaveChangesAsync();
    }
    
    // NO decide nada, solo ejecuta
}`,
        simpleExplanation: "📚 El Repository es el bibliotecario:\n\n✅ \"Dame el libro #5\" → Lo busca y da\n✅ \"Guarda este libro\" → Lo archiva\n✅ \"Dame libros de ciencia\" → Los busca\n\n❌ NO decide si el libro es bueno\n❌ NO analiza contenido\n\n🎯 En invernaderos: Service decía \"Guarda esta lectura\", Repository la guardaba sin preguntar nada."
    },
    {
        id: 7,
        category: "backend",
        question: "¿Qué ventaja ofrece separar el Repository si se decide cambiar el motor de base de datos?",
        answer: "Permite modificar solo la capa de persistencia sin que la capa de Service o la lógica de negocio se vean afectadas.",
        codeExample: `// Cambio de SQL Server → PostgreSQL

// Service NO cambia
public class SensorService {
    private readonly ISensorRepository _repo;
    
    public async Task<SensorDto> GetAsync(int id) {
        var sensor = await _repo.GetByIdAsync(id);
        // Misma lógica, no importa la BD
        return MapToDto(sensor);
    }
}

// Solo cambia Repository
// ANTES: SqlServerContext
// DESPUÉS: PostgresContext
// ¡Service sigue igual!`,
        simpleExplanation: "🔌 Es como cambiar el cargador de tu celular:\n\n**Sin separación**: Cable soldado al teléfono → Para cambiar cargador cambias TODO el teléfono 😰\n\n**Con separación**: Celular → Cable USB → Adaptador\nCambias el adaptador, el celular ni se entera 😊\n\n🎯 Real: Consideramos migrar de SQL Server a PostgreSQL (ahorro de licencias). Con Repository separado, solo cambiaríamos esa capa."
    },
    {
        id: 8,
        category: "backend",
        question: "Concepto: DTO (Data Transfer Object)",
        answer: "Definición: Una clase simple sin lógica ni comportamiento diseñada exclusivamente para transportar datos entre las capas del sistema.",
        codeExample: `// DTO = Contenedor simple
public class UserDto {
    public int Id { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
}

// vs. Entidad (tiene TODO)
public class User {
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }  // Sensible
    public string SecurityStamp { get; set; } // Sensible
    public DateTime CreatedAt { get; set; }
    // + 10 campos más
}`,
        simpleExplanation: "📦 El DTO es como una caja de delivery:\n\n🏪 **Tienda (BD)**: Tiene todo el inventario, precios de costo, proveedores, info confidencial.\n\n📦 **Caja (DTO)**: Solo lleva lo que pediste - tu hamburguesa y papas.\n\n🏠 **Cliente**: Recibe solo lo necesario.\n\n🎯 Real: La entidad User en BD tenía 15 campos. El DTO solo 3: id, email, role. El frontend nunca vio el PasswordHash."
    },
    {
        id: 9,
        category: "backend",
        question: "¿Por qué se utilizan DTOs para mejorar la seguridad de una API?",
        answer: "Para evitar la exposición de campos sensibles de las entidades de base de datos, como hashes de contraseñas o campos internos.",
        codeExample: `// ❌ PELIGRO: Devuelves entidad
[HttpGet("{id}")]
public User GetUser(int id) {
    return _context.Users.Find(id);
    // Cliente recibe: PasswordHash, SecurityStamp...
}

// ✅ SEGURO: Usas DTO
[HttpGet("{id}")]
public UserDto GetUser(int id) {
    var user = _context.Users.Find(id);
    return new UserDto {
        Id = user.Id,
        Email = user.Email
        // PasswordHash NO sale
    };
}`,
        simpleExplanation: "🛡️ El DTO es un escudo:\n\n**Ir al doctor**:\n- Expediente completo: nombre, edad, alergias, historial, dirección, NSS, deudas...\n- Doctor te muestra: diagnóstico, receta, próxima cita.\n\n🚫 Sin DTO: Te dan el expediente completo (riesgo)\n✅ Con DTO: Solo ves lo necesario\n\n🎯 Real: Si exponíamos PasswordHash, un hacker podría intentar descifrarlo. Con DTO, nunca sale del servidor."
    },
    {
        id: 10,
        category: "backend",
        question: "¿Cómo ayudan los DTOs al desacoplamiento entre el cliente y la base de datos?",
        answer: "Permiten cambiar la estructura interna de las tablas sin romper el contrato o formato de datos que espera el cliente de la API.",
        codeExample: `// Cambio interno sin romper frontend

// ANTES: BD tiene "SensorName"
public class Sensor {
    public string SensorName { get; set; }
}

// DTO siempre muestra "Name"
public class SensorDto {
    public string Name { get; set; }
}

// Mapeo: BD → API
new SensorDto { Name = entity.SensorName };

// DESPUÉS: Cambias BD a "Name"
// DTO no cambia
// Frontend sigue funcionando`,
        simpleExplanation: "🔌 Adaptador universal:\n\n**Sin DTO**: Laptop con cargador específico de Bolivia → Viajas a México → No sirve 😰\n\n**Con DTO**: Laptop → Adaptador → Cualquier enchufe\nViajas a México → Solo cambias adaptador 😊\n\n🎯 Real: Renombramos columnas en SQL Server. Como usábamos DTOs, el equipo de frontend en México no se enteró - su código siguió igual."
    },
    {
        id: 11,
        category: "backend",
        question: "¿Qué campos internos de ASP.NET Core Identity suelen ocultarse mediante el uso de DTOs?",
        answer: "Campos como PasswordHash, SecurityStamp y otros metadatos internos de gestión de usuarios.",
        codeExample: `// Identity User tiene ~15 campos internos
public class ApplicationUser : IdentityUser {
    // Campos que NUNCA deben exponerse:
    public string PasswordHash { get; set; }
    public string SecurityStamp { get; set; }
    public string ConcurrencyStamp { get; set; }
    public bool EmailConfirmed { get; set; }
    public bool PhoneNumberConfirmed { get; set; }
    // ... 10 más
}

// DTO expone solo lo necesario
public class UserDto {
    public string Id { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
}`,
        simpleExplanation: "🔐 Es como tu cuenta bancaria:\n\nEl banco tiene:\n- Saldo ✅ (lo ves)\n- Historial ✅ (lo ves)\n- Claves de seguridad internas 🚫\n- Algoritmos anti-fraude 🚫\n- Códigos de auditoría 🚫\n\nTú solo ves lo necesario, no la cocina interna.\n\n🎯 En invernaderos: Los técnicos veían email y rol. Nunca el PasswordHash ni tokens internos de Identity."
    },
    {
        id: 12,
        category: "backend",
        question: "¿Cómo se realizaba el mapeo entre entidades y DTOs en el proyecto de invernaderos?",
        answer: "Se realizaba de forma manual en la capa de Service, asignando las propiedades campo por campo para mantener dependencias mínimas.",
        codeExample: `// Mapeo manual en Service
public async Task<SensorDto> GetByIdAsync(int id) {
    var entity = await _repo.GetByIdAsync(id);
    
    // Mapeo manual campo por campo
    var dto = new SensorDto {
        Id = entity.Id,
        Name = entity.SensorName,
        Type = entity.Type,
        Active = entity.IsActive
    };
    
    return dto;
}

// Simple pero verboso
// Alternativa: AutoMapper (para proyectos grandes)`,
        simpleExplanation: "📋 Es como copiar info de un formulario a otro:\n\n**Manual**: Lees cada campo y lo escribes en el nuevo formulario.\n- Ventaja: Sabes exactamente qué copias\n- Desventaja: Tedioso si son muchos campos\n\n**AutoMapper**: Fotocopiadora automática\n- Ventaja: Rápido\n- Desventaja: Dependencia extra\n\n🎯 Decisión en invernaderos: Teníamos pocas entidades (< 20), el mapeo manual fue suficiente y más claro."
    },
    {
        id: 13,
        category: "backend",
        question: "¿En qué casos se suele preferir el mapeo manual sobre librerías como AutoMapper?",
        answer: "En proyectos de escala pequeña o mediana donde se busca mantener la simplicidad y evitar dependencias externas adicionales.",
        codeExample: `// Decisión: ¿Manual o AutoMapper?

// MANUAL (Proyecto pequeño)
// - Ventajas: Sin dependencias, control total
// - 10-20 entidades: Manejable

var dto = new UserDto {
    Id = user.Id,
    Email = user.Email
};

// AUTOMAPPER (Proyecto grande)
// - Ventajas: Rápido, menos código
// - 50+ entidades: Necesario

services.AddAutoMapper(typeof(Startup));
var dto = _mapper.Map<UserDto>(user);`,
        simpleExplanation: "🛠️ Es como elegir herramienta:\n\n**Proyecto pequeño (casa)**:\n- 10 cuadros para colgar\n- Herramienta: Martillo simple ✅\n- No necesitas taladro industrial\n\n**Proyecto grande (edificio)**:\n- 500 cuadros para colgar\n- Herramienta: Taladro eléctrico ✅\n- El martillo sería eterno\n\n🎯 Invernaderos: 15 entidades, mapeo manual fue perfecto. Un proyecto bancario con 200 entidades sí necesitaría AutoMapper."
    },
    {
        id: 14,
        category: "backend",
        question: "Concepto: Entity Framework Core (EF Core)",
        answer: "Definición: Es un ORM (Object-Relational Mapper) que permite interactuar con la base de datos utilizando objetos de C# en lugar de SQL.",
        codeExample: `// Magia del ORM: C# → SQL

// En C# escribes:
var sensors = await context.Sensors
    .Where(s => s.Active == true)
    .OrderBy(s => s.Name)
    .ToListAsync();

// EF Core lo traduce a SQL:
SELECT * FROM Sensors
WHERE Active = 1
ORDER BY Name

// No escribes SQL manualmente`,
        simpleExplanation: "🔮 EF Core es tu traductor automático:\n\n**Sin ORM**: Tú hablas inglés, la BD habla alemán → Escribes SQL manualmente 😰\n\n**Con ORM (EF Core)**: Hablas C#, EF Core traduce a SQL automáticamente 😊\n\n🎯 En invernaderos: Escribíamos consultas en C# (cómodo), EF Core las traducía a SQL que SQL Server entendía. Menos errores, más rápido de escribir."
    },
    {
        id: 15,
        category: "backend",
        question: "En EF Core, ¿qué representa cada propiedad de tipo DbSet en el contexto de datos?",
        answer: "Representa una tabla específica de la base de datos con la que se pueden realizar operaciones de consulta y persistencia.",
        codeExample: `// DbContext = Mapa de la BD
public class AppDbContext : DbContext {
    // Cada DbSet = Una tabla
    public DbSet<Sensor> Sensors { get; set; }
    public DbSet<Reading> Readings { get; set; }
    public DbSet<User> Users { get; set; }
    
    // En SQL Server existen:
    // - Tabla "Sensors"
    // - Tabla "Readings"  
    // - Tabla "Users"
}

// Accedes así:
context.Sensors.Add(newSensor);`,
        simpleExplanation: "🗺️ DbContext es el mapa del almacén:\n\n**Almacén físico**:\n- Pasillo A: Sensores\n- Pasillo B: Lecturas\n- Pasillo C: Usuarios\n\n**En código**:\n- DbSet<Sensor>: Pasillo A\n- DbSet<Reading>: Pasillo B\n- DbSet<User>: Pasillo C\n\n🎯 En invernaderos: context.Sensors era nuestra \"puerta\" para acceder a todos los sensores sin escribir SQL."
    },
    {
        id: 16,
        category: "backend",
        question: "¿Qué método de EF Core se utiliza para persistir todos los cambios realizados en una sola transacción?",
        answer: "El método SaveChangesAsync().",
        codeExample: `// SaveChanges = Guardar todos los cambios

context.Sensors.Add(newSensor);
context.Readings.Remove(oldReading);
context.Users.Update(user);

// Nada se guarda todavía...

await context.SaveChangesAsync();
// ¡AHORA sí! Todo o nada (transacción)

// Si falla algo, se revierte TODO`,
        simpleExplanation: "💾 SaveChanges es como el botón \"Guardar\" de Word:\n\n✏️ Escribes en Word → Solo está en memoria\n💾 Click en Guardar → Se escribe al disco\n\n🎯 En código:\n- Haces cambios → Solo en memoria (RAM)\n- SaveChangesAsync() → Se guardan en BD\n\n**Transacción**: Si falla algo (ej: disco lleno), se revierten TODOS los cambios. Es todo o nada."
    },
    {
        id: 17,
        category: "backend",
        question: "¿Qué es LINQ en el ecosistema de .NET?",
        answer: "Es una sintaxis declarativa integrada en C# que permite realizar consultas, filtrados y ordenamientos sobre colecciones de datos.",
        codeExample: `// LINQ = SQL dentro de C#

// LINQ (C#):
var result = readings
    .Where(r => r.Temperature > 25)
    .OrderByDescending(r => r.Timestamp)
    .Take(10)
    .ToList();

// Equivalente en SQL:
SELECT TOP 10 *
FROM Readings
WHERE Temperature > 25
ORDER BY Timestamp DESC

// ¡Mismo resultado!`,
        simpleExplanation: "🔍 LINQ es como hacer búsquedas en Excel:\n\n**Excel**: Usas filtros visuales para buscar\n**LINQ**: Usas código para buscar\n\n🎯 En invernaderos:\n\"Dame las últimas 10 lecturas donde temperatura > 25°C\"\n\nLINQ lo hace en una línea de código. Sin LINQ necesitarías un foreach gigante revisando uno por uno."
    },
    {
        id: 18,
        category: "backend",
        question: "¿Cuándo es preferible escribir SQL directo o usar vistas en lugar de depender totalmente de EF Core?",
        answer: "Cuando el rendimiento es crítico y las consultas generadas por el ORM no son lo suficientemente eficientes para grandes volúmenes de datos.",
        codeExample: `// EF Core bueno para CRUD normal
var sensors = await context.Sensors
    .Where(s => s.Active)
    .ToListAsync();
// Rápido, simple ✅

// Para reportes complejos: SQL directo
var stats = await context.Database
    .SqlQueryRaw<Stats>(@"
        SELECT 
            AVG(Temperature) as AvgTemp,
            MAX(Temperature) as MaxTemp
        FROM Readings
        WHERE SensorId = @id
        GROUP BY DATEPART(hour, Timestamp)
    ", id).ToListAsync();
// Más control, más rápido`,
        simpleExplanation: "🚗 Es como elegir vehículo:\n\n**EF Core = Auto normal**:\n- Ciudad: Perfecto ✅\n- Ida al super: Ideal ✅\n\n**SQL directo = Camión de carga**:\n- Mover 50 muebles: Necesario ✅\n- Reportes complejos: Más eficiente ✅\n\n🎯 Real: Para consultas simples usábamos EF Core. Para el historial con 500K+ lecturas y joins complejos, usamos SQL directo (8s → 200ms)."
    },
    {
        id: 19,
        category: "backend",
        question: "¿Cuál era la causa técnica de que las consultas de historial de sensores tardaran 8 segundos?",
        answer: "La base de datos realizaba un 'Full Table Scan' debido a la falta de índices adecuados para los filtros de búsqueda.",
        codeExample: `// Query lenta (8 segundos)
SELECT * FROM Readings
WHERE SensorId = 5 
  AND Timestamp BETWEEN '2020-01' AND '2020-02'

// SQL Server hace:
// 1. Lee fila 1: ¿SensorId=5? No, skip
// 2. Lee fila 2: ¿SensorId=5? No, skip
// ... 500,000 filas después...
// 500,000: ¿SensorId=5? Sí, toma

// Full Table Scan = Revisar TODO`,
        simpleExplanation: "📚 Es como buscar un libro en biblioteca desorganizada:\n\n**Sin índice (8s)**:\n🏃 Revisas libro por libro hasta encontrar el que quieres\n- Libro 1: No es\n- Libro 2: No es\n... 50,000 libros después...\n- Libro 50,000: ¡Este es!\n\n**Con índice (0.2s)**:\n📋 Consultas el catálogo → Va directo al estante correcto\n\n🎯 Real: 500K lecturas sin índice = 8 segundos de búsqueda."
    },
    {
        id: 20,
        category: "backend",
        question: "¿Qué ocurre técnicamente durante un 'Full Table Scan' en SQL Server?",
        answer: "El motor de la base de datos debe revisar cada fila de la tabla una por una para encontrar los registros que coinciden con el filtro.",
        codeExample: `// Full Table Scan = Revisar TODO

Tabla Readings: 500,000 filas

Query: WHERE SensorId = 5

SQL Server hace:
for (i = 1; i <= 500000; i++) {
    if (row[i].SensorId == 5) {
        results.Add(row[i]);
    }
}

// 500,000 comparaciones = LENTO
// Con índice: 10-20 comparaciones = RÁPIDO`,
        simpleExplanation: "🔍 Es buscar tu auto en estacionamiento gigante:\n\n**Table Scan (malo)**:\n🏃 Caminas por TODO el estacionamiento\n- Fila 1: No es mi auto\n- Fila 2: No es mi auto\n... 10,000 autos después...\n- Fila 10,000: ¡Es el mío!\n⏱️ 30 minutos\n\n**Index Seek (bueno)**:\n📱 App te dice: \"Fila 47, posición B12\"\nVas directo → 2 minutos\n\n🎯 Diferencia: Revisar todo vs. Ir directo al lugar."
    },
    {
        id: 21,
        category: "backend",
        question: "¿Qué solución se implementó para optimizar el filtrado por sensor y rango de fechas?",
        answer: "Se creó un índice compuesto que incluía las columnas SensorId y Timestamp de forma conjunta.",
        codeExample: `// Crear índice compuesto
CREATE NONCLUSTERED INDEX IX_Readings_Sensor_Date
ON Readings (SensorId, Timestamp DESC)

-- Antes: 8 segundos
SELECT * FROM Readings
WHERE SensorId = 5
  AND Timestamp BETWEEN '2020-01' AND '2020-02'

-- Después: 0.2 segundos
-- ¡40x más rápido!

-- SQL Server ahora va directo
-- No revisa las 500K filas`,
        simpleExplanation: "📇 El índice es como un directorio telefónico organizado:\n\n**Sin índice**:\nTelefones escritos en papelitos al azar\nBuscar a \"Juan Pérez\" → Revisar TODOS los papeles 😰\n\n**Con índice**:\nDirectorio alfabético A-Z\nBuscar a \"Juan Pérez\" → Vas directo a la página J → P 😊\n\n🎯 Real: Índice en (SensorId, Timestamp) = SQL Server salta directo a \"Sensor 5, Enero 2020\" sin revisar los otros 499,000 registros."
    },
    {
        id: 22,
        category: "backend",
        question: "¿Por qué se utilizó un índice compuesto en lugar de dos índices separados para el historial de sensores?",
        answer: "Porque las consultas siempre filtraban por ambos campos simultáneamente, permitiendo al motor ir directo a las filas relevantes.",
        codeExample: `// Query típica
WHERE SensorId = 5 
  AND Timestamp BETWEEN '2020-01' AND '2020-02'

// Índice compuesto (óptimo)
(SensorId, Timestamp)
→ Va directo a: "Sensor 5, rango Enero"

// Dos índices separados (subóptimo)
Índice 1: (SensorId)
Índice 2: (Timestamp)
→ SQL Server elige UNO, luego filtra
→ Más lento`,
        simpleExplanation: "🗂️ Es como organizar documentos:\n\n**Índice compuesto**:\nCarpetas: \"Cliente A - 2020\", \"Cliente A - 2021\"\nBuscas \"Cliente A, Enero 2020\" → Vas directo 🎯\n\n**Índices separados**:\nCarpetas por cliente, otras carpetas por año (separadas)\nBuscas \"Cliente A, Enero 2020\" → Primero buscas cliente, luego el año (2 pasos) 😐\n\n🎯 Real: Como SIEMPRE buscábamos \"sensor X en fecha Y\", el índice compuesto era perfecto."
    },
    {
        id: 23,
        category: "backend",
        question: "¿Qué herramienta se utilizó para identificar el cuello de botella en las consultas SQL?",
        answer: "El plan de ejecución dentro de SQL Server Management Studio (SSMS).",
        codeExample: `// En SSMS:
-- 1. Activa plan de ejecución
Ctrl + M

-- 2. Ejecuta tu query
SELECT * FROM Readings WHERE...

-- 3. Ve la pestaña "Execution Plan"
-- Verás:
[Table Scan] 95% ❌ MALO
vs
[Index Seek] 5% ✅ BUENO

-- El porcentaje te dice dónde
-- está el problema`,
        simpleExplanation: "🔬 El plan de ejecución es como un rayos-X:\n\n**Paciente**: \"Doctor, me duele\"\n\n**Sin rayos-X**: Adivinas qué tiene 🤷\n\n**Con rayos-X**: Ves exactamente dónde está el problema - hueso roto 📸\n\n🎯 En invernaderos: El plan nos mostró: \"Table Scan 95%\" = Ahí está el problema. Agregamos índice → \"Index Seek 5%\" = Problema resuelto."
    },
    {
        id: 24,
        category: "backend",
        question: "Concepto: Dependency Injection (DI)",
        answer: "Definición: Patrón de diseño donde las dependencias de una clase se inyectan desde el exterior en lugar de que la clase las cree internamente.",
        codeExample: `// Sin DI (malo)
class Service {
    private Repo _repo = new Repo(); // ❌
}

// Con DI (bueno)
class Service {
    private readonly IRepo _repo;
    
    public Service(IRepo repo) { // ✅
        _repo = repo;
    }
}

// ASP.NET lo inyecta automáticamente
services.AddScoped<IRepo, Repo>();`,
        simpleExplanation: "🔌 DI es como enchufes intercambiables:\n\n**Sin DI**: Electrodoméstico con cable soldado → Cable se daña = Botas todo el aparato 😰\n\n**Con DI**: Electrodoméstico → Enchufe estándar → Cable\nCable se daña = Solo cambias el cable 😊\n\n🎯 En tests: Sin DI no puedes cambiar el Repository real por uno de prueba. Con DI, lo cambias fácilmente sin tocar el Service."
    },
    {
        id: 25,
        category: "backend",
        question: "¿Qué problema principal resuelve la Inyección de Dependencias respecto al acoplamiento?",
        answer: "Evita que las clases estén atadas a implementaciones concretas, facilitando el intercambio de componentes y la realización de pruebas unitarias.",
        codeExample: `// Sin DI: Acoplado
class Service {
    private SqlRepo _repo = new SqlRepo();
    // Imposible cambiar a MockRepo para tests
}

// Con DI: Desacoplado  
class Service {
    private IRepo _repo;
    public Service(IRepo repo) { _repo = repo; }
}

// En producción:
services.AddScoped<IRepo, SqlRepo>();

// En tests:
services.AddScoped<IRepo, MockRepo>();`,
        simpleExplanation: "🎭 Es como actores en una obra:\n\n**Sin DI**: Batman solo puede ser interpretado por un actor específico → Si se enferma, cancelas la obra 😰\n\n**Con DI**: Batman es un rol que puede ser interpretado por varios actores → Si uno falla, entra su suplente 😊\n\n🎯 En tests: Queríamos probar el Service sin tocar la BD real. Con DI, inyectamos un MockRepo que simula la BD."
    },
    {
        id: 26,
        category: "backend",
        question: "¿Dónde se registran típicamente los servicios para la DI en una aplicación ASP.NET Core?",
        answer: "En la clase Startup.cs o Program.cs, utilizando métodos como services.AddScoped().",
        codeExample: `// Program.cs (ASP.NET Core 6+)
var builder = WebApplication.CreateBuilder(args);

// Registrar servicios
builder.Services.AddScoped<ISensorService, SensorService>();
builder.Services.AddScoped<ISensorRepo, SensorRepo>();
builder.Services.AddDbContext<AppDbContext>();

// ASP.NET los inyecta automáticamente
var app = builder.Build();`,
        simpleExplanation: "📋 Es como registrar trabajadores en recursos humanos:\n\n**Startup/Program.cs = Oficina de RRHH**\n\n\"Cuando alguien necesite un ISensorService, dale un SensorService\"\n\n**Controller = Empleado**\n\n\"Hola RRHH, necesito un ISensorService\"\n→ RRHH se lo da automáticamente\n\n🎯 Lo registras una vez al inicio, ASP.NET lo maneja el resto del tiempo."
    },
    {
        id: 27,
        category: "backend",
        question: "¿Cómo ayuda el contenedor de DI a prevenir errores en tiempo de ejecución?",
        answer: "Permite detectar configuraciones incorrectas o dependencias faltantes al momento de arrancar la aplicación en lugar de cuando el usuario la usa.",
        codeExample: `// Olvidas registrar el servicio
// NO registras: services.AddScoped<IRepo, Repo>();

// Al arrancar la app:
❌ Error inmediato:
"Unable to resolve service for type 'IRepo'"

// Sin DI, el error aparecería:
✅ App arranca
😰 Usuario hace click
💥 NullReferenceException
// ¡Demasiado tarde!`,
        simpleExplanation: "🚗 Es como revisar el auto antes de viajar:\n\n**Con DI**: Revisas antes de salir\n- ¿Hay gasolina? ✅\n- ¿Llantas infladas? ✅\n- ¿Falta algo? ❌ No arranca\n\n**Sin DI**: Sales sin revisar\n- Todo parece bien...\n- 100km después: Se apaga\n- Olvidaste echar gasolina 😰\n\n🎯 Real: Si olvidábamos registrar un servicio, la app ni arrancaba. Mejor que falle temprano que cuando hay usuarios."
    },
    {
        id: 28,
        category: "backend",
        question: "¿Qué funciones cumple ASP.NET Core Identity en el sistema?",
        answer: "Gestiona el registro de usuarios, el inicio de sesión, el hashing de contraseñas y la administración de roles de seguridad.",
        codeExample: `// ASP.NET Core Identity incluye:

// UserManager: CRUD de usuarios
await _userManager.CreateAsync(user, password);

// SignInManager: Login/Logout
await _signInManager.PasswordSignInAsync(email, pwd);

// RoleManager: Gestión de roles
await _roleManager.CreateAsync(new Role("Admin"));

// PasswordHasher: Encriptar contraseñas
// (automático, no guardas contraseñas en texto plano)`,
        simpleExplanation: "🏰 Identity es el sistema de seguridad del castillo:\n\n**UserManager = Registro de habitantes**\n- Anota quién vive en el castillo\n\n**SignInManager = Guardia de la puerta**\n- Verifica identidad al entrar\n\n**RoleManager = Rangos (Rey, Guardia, Sirviente)**\n- Define qué puede hacer cada quien\n\n**PasswordHasher = Encriptador de claves**\n- Nunca guarda contraseñas en texto plano\n\n🎯 En invernaderos: Roles \"Admin\" y \"Técnico\" con permisos diferentes."
    },
    {
        id: 29,
        category: "backend",
        question: "¿Cómo se restringe el acceso a un endpoint para que solo lo usen administradores en .NET?",
        answer: "Se utiliza el atributo [Authorize(Roles = \"Admin\")] sobre la acción del controlador.",
        codeExample: `// Endpoint solo para Admins
[Authorize(Roles = "Admin")]
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteSensor(int id) {
    await _service.DeleteAsync(id);
    return NoContent();
}

// Si un Técnico intenta:
// 403 Forbidden ❌

// Sin [Authorize]:
// Cualquiera puede ejecutarlo ⚠️`,
        simpleExplanation: "🚪 Es como accesos en un edificio:\n\n**Sin [Authorize]**: Puerta sin llave\n→ Cualquiera entra 🚶\n\n**Con [Authorize]**: Puerta con llave\n→ Solo usuarios autenticados 🔑\n\n**Con [Authorize(Roles = \"Admin\")]**: Puerta con llave especial\n→ Solo administradores 👑\n\n🎯 Real: Solo admins podían borrar sensores. Si un técnico intentaba, recibía \"Acceso denegado\"."
    },
    {
        id: 30,
        category: "backend",
        question: "Concepto: SignalR",
        answer: "Definición: Librería de ASP.NET que permite añadir funcionalidades web en tiempo real enviando actualizaciones del servidor al cliente instantáneamente.",
        codeExample: `// Hub de SignalR
public class SensorHub : Hub {
    public async Task SendReading(Reading data) {
        // Envía a TODOS los clientes conectados
        await Clients.All.SendAsync("ReceiveReading", data);
    }
}

// En el frontend (JavaScript):
connection.on("ReceiveReading", (data) => {
    updateDashboard(data);
    // Dashboard se actualiza SOLO
});`,
        simpleExplanation: "📡 SignalR es como una transmisión en vivo:\n\n**Sin SignalR (Polling)**:\nTú: \"¿Hay algo nuevo?\"\nServidor: \"No\"\n(5s después)\nTú: \"¿Ahora?\"\nServidor: \"No\"\n→ Preguntas constantemente 😰\n\n**Con SignalR**:\nServidor: \"¡Hey! Dato nuevo\"\nTú: \"Ok, lo muestro\"\n→ El servidor te avisa cuando hay algo 😊\n\n🎯 POC: Cuando llegaba lectura nueva, el dashboard se actualizaba SOLO sin refrescar."
    },
    {
        id: 31,
        category: "backend",
        question: "¿Por qué es más eficiente SignalR que el 'polling' tradicional para un dashboard?",
        answer: "Evita que el cliente pregunte repetidamente si hay datos nuevos, permitiendo que el servidor empuje la información solo cuando ésta llega.",
        codeExample: `// Polling (ineficiente)
setInterval(async () => {
    const data = await fetch('/api/readings');
    // Pregunta cada 5s aunque no haya cambios
}, 5000);
// 12 peticiones/minuto = Desperdicio

// SignalR (eficiente)
connection.on("NewReading", (data) => {
    // Solo cuando HAY cambios
});
// 0-5 peticiones/minuto = Eficiente`,
        simpleExplanation: "📞 Es como comunicarte con alguien:\n\n**Polling**: Llamadas repetidas\nTú: \"¿Ya terminaste?\"\nAmigo: \"No\"\n(30s después)\nTú: \"¿Ya?\"\nAmigo: \"No\"\n→ 20 llamadas molestas 😰\n\n**SignalR**: Una llamada\nTú: \"Avísame cuando termines\"\nAmigo: \"Ok\" ✅\n(1 hora después)\nAmigo: \"¡Listo!\"\n→ 1 llamada eficiente 😊\n\n🎯 Con polling: 12 requests/min. Con SignalR: Solo cuando hay datos nuevos."
    },
    {
        id: 32,
        category: "backend",
        question: "¿Qué técnica de comunicación utiliza SignalR preferentemente antes de recurrir a alternativas?",
        answer: "Utiliza WebSockets como transporte principal para la comunicación bidireccional.",
        codeExample: `// SignalR intenta en orden:

1. WebSockets (mejor)
   - Conexión persistente bidireccional
   - Latencia mínima
   
2. Server-Sent Events (fallback)
   - Si WebSockets no disponible
   
3. Long Polling (último recurso)
   - Navegadores muy antiguos

// SignalR elige automáticamente
// el mejor disponible`,
        simpleExplanation: "📞 Es como elegir cómo comunicarte:\n\n**WebSockets**: Walkie-talkie\n- Comunicación instantánea en ambos sentidos 📡\n- Lo mejor\n\n**SSE**: Radio FM\n- Solo servidor → cliente 📻\n- Backup\n\n**Long Polling**: Mensajero\n- Va y viene constantemente 🚶\n- Último recurso\n\nSignalR intenta WebSockets primero, si falla prueba las otras."
    },
    {
        id: 33,
        category: "backend",
        question: "¿Cómo se implementa la validación automática de modelos en ASP.NET Core?",
        answer: "Mediante el uso de Data Annotations (como [Required] o [Range]) en las propiedades de los DTOs de entrada.",
        codeExample: `// DTO con validación automática
public class CreateSensorDto {
    [Required(ErrorMessage = "Nombre requerido")]
    [MaxLength(100)]
    public string Name { get; set; }
    
    [Range(0, 100)]
    public double Humidity { get; set; }
}

// ASP.NET valida automáticamente
[HttpPost]
public IActionResult Create(CreateSensorDto dto) {
    if (!ModelState.IsValid)
        return BadRequest(ModelState);
    // ...
}`,
        simpleExplanation: "✅ Son como las reglas de un formulario:\n\n**Formulario en papel**:\n□ Nombre: _________ (obligatorio)\n□ Edad: ___ (entre 0-150)\n\nSi dejas Nombre vacío → Rechazo ❌\n\n**Data Annotations**:\nHacen lo mismo pero automático\nSi envías dato malo → Error 400 ❌\n\n🎯 En invernaderos: Si intentabas crear sensor sin nombre o con humedad = 200%, la API respondía \"Dato inválido\" antes de llegar al Service."
    },
    {
        id: 34,
        category: "backend",
        question: "¿Qué código de estado HTTP devuelve automáticamente ASP.NET Core si falla la validación por Data Annotations?",
        answer: "Devuelve un código 400 Bad Request junto con el detalle de los campos que fallaron.",
        codeExample: `// Envías DTO inválido:
{
    "name": "",  // Vacío (Required)
    "humidity": 150  // Fuera de rango (0-100)
}

// Respuesta automática de ASP.NET:
400 Bad Request
{
    "errors": {
        "name": ["Nombre requerido"],
        "humidity": ["Debe estar entre 0 y 100"]
    }
}

// No necesitas código manual`,
        simpleExplanation: "🚫 Es como un guardia de seguridad:\n\n**Intentas entrar al edificio con**:\n- Sin gafete ❌\n- Con credencial vencida ❌\n\n**Guardia**: \"No puedes pasar, falta gafete y credencial está vencida\"\n\n**API con Data Annotations**:\n- Envías datos mal ❌\n- API: \"400 Bad Request: falta nombre, humedad inválida\"\n\n🎯 El frontend recibe exactamente qué campos están mal para mostrárselo al usuario."
    },
    {
        id: 35,
        category: "backend",
        question: "¿Cuál es la diferencia entre validación de DTO y validación de negocio?",
        answer: "El DTO valida el formato (ej. campos obligatorios), mientras que la de negocio valida reglas lógicas (ej. si un sensor ya existe).",
        codeExample: `// Validación de DTO (formato)
public class SensorDto {
    [Required]  // ¿Está lleno?
    [MaxLength(50)]  // ¿No es muy largo?
    public string Name { get; set; }
}

// Validación de negocio (lógica)
public class SensorService {
    public async Task Create(SensorDto dto) {
        // ¿Ya existe otro sensor con ese nombre?
        if (await _repo.ExistsAsync(dto.Name))
            throw new Exception("Ya existe");
    }
}`,
        simpleExplanation: "📋 Dos niveles de revisión:\n\n**Validación DTO = Formato de formulario**\n¿Llenaste todos los campos? ✅\n¿Escribiste números donde van números? ✅\n\n**Validación Negocio = Reglas de la empresa**\n¿Ya existe un cliente con ese email? ❌\n¿El producto tiene stock? ❌\n\n🎯 Ejemplo real: DTO valida que escribiste un nombre. Service valida que ese nombre no exista ya en el sistema."
    },
    {
        id: 36,
        category: "backend",
        question: "¿Qué código HTTP se debe devolver si un recurso solicitado no existe en el sistema?",
        answer: "El código 404 Not Found.",
        codeExample: `[HttpGet("{id}")]
public async Task<IActionResult> Get(int id) {
    var sensor = await _service.GetAsync(id);
    
    if (sensor == null)
        return NotFound();  // 404
    
    return Ok(sensor);  // 200
}

// Usuario pide sensor #999 que no existe
// → 404 Not Found`,
        simpleExplanation: "🔍 Como buscar casa con Google Maps:\n\n**404 Not Found**: \"No encontramos esa dirección\"\n- La casa simplemente no existe\n\n**500 Error**: \"Google Maps se rompió\"\n- El problema es del sistema\n\n🎯 En invernaderos: Si pedían sensor #999 que no existía → 404. Si la BD estaba caída → 500."
    },
    {
        id: 37,
        category: "backend",
        question: "¿Cómo se gestionaban las nuevas funcionalidades y correcciones de errores en el flujo de Git?",
        answer: "Mediante el uso de ramas (branches) por cada feature y Pull Requests para revisión antes de integrar a la rama principal.",
        codeExample: `// Flujo de Git en el proyecto

# 1. Creas rama para tu feature
git checkout -b feature/sensor-alerts

# 2. Desarrollas y commiteas
git add .
git commit -m "Add sensor alerts"

# 3. Push y creas Pull Request
git push origin feature/sensor-alerts

# 4. Senior revisa y aprueba

# 5. Merge a 'main'
// Feature ahora en producción`,
        simpleExplanation: "🌳 Git es como trabajar en copias:\n\n**Sin branches (malo)**:\nTodos escriben en el mismo documento de Word al mismo tiempo → Desastre 😰\n\n**Con branches (bueno)**:\nCada quien tiene su copia → Trabajas tranquilo → Al terminar, se juntan las copias 😊\n\n🎯 Real: Yo trabajaba en mi branch 'feature/signalr-poc' sin afectar a nadie. Al terminar, los seniors revisaban y lo juntaban con el código principal."
    },
    {
        id: 38,
        category: "backend",
        question: "¿Qué papel cumplía Postman en el ciclo de desarrollo del backend?",
        answer: "Se utilizaba para probar y documentar los endpoints manualmente antes de entregarlos al equipo de QA.",
        codeExample: `// Mi workflow con Postman:

1. Desarrollo endpoint en .NET
2. Pruebo en Postman:
   - Happy path ✅
   - Datos inválidos ❌
   - IDs que no existen 🔍
   - Sin autenticación 🔒
   
3. Documento en colección:
   POST /api/sensors
   Body: { "name": "Sensor 1" }
   Headers: { "Authorization": "Bearer ..." }
   
4. Comparto colección con QA
5. QA tiene ejemplos listos para probar`,
        simpleExplanation: "🧪 Postman es tu laboratorio de pruebas:\n\n**Sin Postman**:\nDesarrollas → Pasas a QA → QA encuentra errores → Vuelves a desarrollar 😰\n\n**Con Postman**:\nDesarrollas → Pruebas tú mismo → Encuentras errores → Arreglas → Pasas a QA pulido 😊\n\n🎯 Real: Antes de pasar endpoint a QA, yo probaba 10-15 escenarios en Postman. QA recibía trabajo pre-validado, ahorraba tiempo a ambos."
    },
    {
        id: 39,
        category: "backend",
        question: "¿Cuál es la mejor forma de responder a un entrevistador si te pregunta sobre algo que no implementaste directamente?",
        answer: "Ser honesto indicando que no lo hiciste tú, pero explicar el principio teórico que entiendes sobre cómo funciona.",
        codeExample: `// Respuesta ideal en entrevista:

Entrevistador: "¿Cómo implementaste 
el circuit breaker?"

Tú: "Ese componente específico no lo
implementé yo directamente - fue uno
de los seniors. Pero el principio que
entiendo es que detecta cuando un
servicio externo falla repetidamente
y 'abre el circuito' temporalmente
para evitar más fallos. ¿Es correcto?"

// Muestra: honestidad + comprensión`,
        simpleExplanation: "💬 En entrevistas, honestidad > mentiras:\n\n❌ **Malo**: Inventar que lo hiciste\n\"Sí, yo implementé todo el sistema de cache distribuido con Redis...\"\n(Te preguntan detalles → Te quedas en blanco)\n\n✅ **Bueno**: Ser honesto + mostrar que entiendes\n\"Eso lo diseñaron los seniors, pero entiendo que usa Redis para... ¿Es correcto?\"\n\n🎯 Real: Cuando me preguntaban de cosas que no toqué, decía \"Eso no lo hice yo, pero sé que funciona así...\" Los seniors valoran la honestidad."
    },
    {
        id: 40,
        category: "architecture",
        question: "¿Cuáles son las cuatro capas en las que se estructuró el sistema de gestión de repuestos?",
        answer: "Domain, Application, Infrastructure y API.",
        codeExample: `// Clean Architecture - 4 capas

AutoPartes/
├── Domain/          // Núcleo: Entidades, interfaces
│   ├── Entities/
│   └── Interfaces/
├── Application/     // Casos de uso, lógica
│   ├── UseCases/
│   └── DTOs/
├── Infrastructure/  // EF Core, repos, externos
│   ├── Persistence/
│   └── Services/
└── API/            // Controllers, presentación
    └── Controllers/`,
        simpleExplanation: "🏗️ Clean Architecture es como construir casa:\n\n**Domain = Planos y reglas**\n¿Cuántos cuartos? ¿Dónde va la cocina?\n\n**Application = Casos de uso**\n\"Quiero cocinar\" → Usa la cocina\n\n**Infrastructure = Materiales**\nLadrillos, cemento, instalación\n\n**API = Puertas de entrada**\nPor dónde entras a la casa\n\n🎯 Si cambias ladrillos (Infrastructure), los planos (Domain) siguen iguales."
    },
    {
        id: 41,
        category: "frontend",
        question: "¿Qué librería de RxJS se usó para manejar el estado del usuario de forma reactiva en CayudiApp?",
        answer: "BehaviorSubject.",
        codeExample: `// AuthService con BehaviorSubject
export class AuthService {
    private userSubject = 
        new BehaviorSubject<User | null>(null);
    
    public user$ = this.userSubject.asObservable();
    
    login(user: User) {
        this.userSubject.next(user);
    }
}

// Componentes se suscriben:
this.authService.user$.subscribe(user => {
    console.log('Usuario cambió:', user);
});`,
        simpleExplanation: "📢 BehaviorSubject es como un canal de noticias:\n\n**TV normal**: Si llegas tarde, perdiste la noticia\n\n**BehaviorSubject**: \n- Siempre tiene la última noticia guardada\n- Nuevos canales reciben la noticia actual de inmediato\n- Cuando hay noticia nueva, todos la reciben\n\n🎯 En CayudiApp: Cuando usuario hace login, TODOS los componentes que escuchan user$ se actualizan automáticamente (menú, dashboard, perfil...)."
    },
    {
        id: 42,
        category: "ml",
        question: "¿Qué métrica de similitud se utilizó en el motor de recomendación de libros para comparar patrones de calificación?",
        answer: "La métrica de similitud coseno.",
        codeExample: `// Similitud Coseno en KNN

from sklearn.neighbors import NearestNeighbors

model = NearestNeighbors(
    metric='cosine',  # Métrica de similitud
    algorithm='brute'
)

# Encuentra libros similares
distances, indices = model.kneighbors(
    book_vector, n_neighbors=6
)

// Valor 0 = idénticos
// Valor 1 = totalmente diferentes`,
        simpleExplanation: "📐 Similitud coseno compara patrones, no magnitudes:\n\n**Usuario A**: Da 5⭐ a todo\n**Usuario B**: Da 3⭐ a todo\n\nAmbos califican igual (mismo patrón) pero diferente escala.\n\nSimilitud coseno los ve como similares ✅\n\n🎯 En recomendaciones: Importa QUÉ libros te gustan, no SI das 5⭐ o 3⭐."
    },
    {
        id: 43,
        category: "ml",
        question: "¿Por qué se utilizó una matriz dispersa (csr_matrix) en el preprocesamiento de datos de libros?",
        answer: "Para optimizar la eficiencia en memoria y computación al manejar grandes conjuntos de datos con muchos valores en cero.",
        codeExample: `// Matriz libro-usuario: 673×888

# Matriz normal (densa)
matriz_normal = np.zeros((673, 888))
# 673 × 888 = 597,624 valores
# Ocupación: ~5MB

# Matriz dispersa (sparse)
from scipy.sparse import csr_matrix
matriz_sparse = csr_matrix(datos)
# Solo guarda 49,781 valores no-cero
# Ocupación: ~400KB

# 12x menos memoria!`,
        simpleExplanation: "💾 Matriz dispersa = Agenda solo con contactos:\n\n**Matriz normal (densa)**:\nAgenda con TODAS las páginas A-Z llenas, aunque solo conoces a 50 personas de 1,000 posibles espacios.\n\n**Matriz dispersa (sparse)**:\nAgenda que solo tiene las 50 páginas de tus contactos reales. Páginas vacías no existen.\n\n🎯 En libros: Usuario lee 50 libros de 673 posibles. ¿Para qué guardar los 623 que no leyó?"
    },
    {
        id: 44,
        category: "backend",
        question: "¿Qué es una transacción de base de datos en el contexto de SaveChanges()?",
        answer: "Es un proceso que asegura que todas las operaciones de persistencia se realicen con éxito o que ninguna se aplique si ocurre un error.",
        codeExample: `// Transacción = Todo o nada
using var transaction = await context
    .Database.BeginTransactionAsync();

try {
    context.Orders.Add(order);
    context.Inventory.Update(stock);
    
    await context.SaveChangesAsync();
    await transaction.CommitAsync();  // ✅
    
} catch {
    await transaction.RollbackAsync();  // ❌
    // Si algo falla, NADA se guarda
}`,
        simpleExplanation: "💸 Transacción bancaria:\n\n**Transferir $100 de cuenta A → B**\n\n**Sin transacción (malo)**:\n1. Restar $100 de A ✅\n2. Se cae el sistema 💥\n3. Sumar $100 a B ❌\nResultado: Perdiste $100 😰\n\n**Con transacción (bueno)**:\nTodo ocurre o nada ocurre\nSi paso 2 falla → Paso 1 se revierte\nResultado: $0 perdido 😊\n\n🎯 En pedidos: Si falla actualizar inventario, el pedido tampoco se crea."
    },
    {
        id: 45,
        category: "backend",
        question: "¿Qué es un 'Code Review' y para qué sirve en un equipo junior?",
        answer: "Es la revisión del código por parte de programadores senior para asegurar la calidad y transmitir buenas prácticas de arquitectura.",
        codeExample: `// Mi experiencia con Code Reviews

PR #1 (Mi primera feature):
Senior: "15 comentarios de mejora"
- Usa async/await aquí
- Extrae esto a un método
- Este if puede ser más simple
→ Mucho que aprender 📚

PR #30 (3 meses después):
Senior: "Aprobado ✅"
→ Aprendizaje acelerado 🚀`,
        simpleExplanation: "👀 Code Review = Entrenador revisando jugada:\n\n**Sin reviews**:\nJugas solo → Repites los mismos errores 😰\n\n**Con reviews**:\nJugada → Entrenador la ve → \"Esa posición puede mejorar\"\n→ Mejoras cada jugada 📈\n\n🎯 Real: Los seniors me enseñaron más en code reviews que en cualquier curso. PR #1: 15 comentarios. PR #30: Aprobado directo. La evolución fue clara."
    },
    {
        id: 46,
        category: "backend",
        question: "Diferencia entre 401 Unauthorized y 403 Forbidden.",
        answer: "401 indica que el usuario no está autenticado, mientras que 403 indica que está autenticado pero no tiene permisos para el recurso.",
        codeExample: `// 401 Unauthorized
[HttpGet]
[Authorize]  // Requiere login
public IActionResult GetData() {
    // Usuario NO logueado → 401
}

// 403 Forbidden
[HttpDelete]
[Authorize(Roles = "Admin")]
public IActionResult Delete(int id) {
    // Usuario logueado pero NO admin → 403
}`,
        simpleExplanation: "🚪 Acceso al edificio de oficinas:\n\n**401 Unauthorized**:\nGuardia: \"¿Quién eres?\"\nTú: \"Soy Juan\"\nGuardia: \"No te conozco\" ❌\n→ No estás en el sistema\n\n**403 Forbidden**:\nGuardia: \"Hola Juan, te conozco\"\nTú: \"Voy al piso 10\"\nGuardia: \"Solo admins suben\" ❌\n→ Estás en el sistema pero no tienes acceso\n\n🎯 401 = \"¿Quién eres?\" / 403 = \"Te conozco pero no puedes\""
    },
    {
        id: 47,
        category: "backend",
        question: "¿Qué es un 'Seeding' de base de datos?",
        answer: "Es el proceso de poblar la base de datos con datos iniciales necesarios para que la aplicación funcione en entornos de desarrollo o pruebas.",
        codeExample: `// Database Seeding en EF Core
protected override void OnModelCreating(
    ModelBuilder builder) {
    
    builder.Entity<Role>().HasData(
        new Role { Id = 1, Name = "Admin" },
        new Role { Id = 2, Name = "User" }
    );
    
    builder.Entity<User>().HasData(
        new User { 
            Id = 1, 
            Email = "admin@test.com",
            RoleId = 1
        }
    );
}`,
        simpleExplanation: "🌱 Seeding = Plantar semillas iniciales:\n\n**Jardín nuevo (BD vacía)**:\n- Tierra lista ✅\n- Sin plantas ❌\n- Necesitas plantar algo para empezar\n\n**Seeding = Plantar las primeras plantas**:\n- Rol Admin\n- Rol User\n- Usuario administrador inicial\n\n🎯 En desarrollo: Cada vez que creabas la BD, ya tenía roles y un admin de prueba. No empezabas de cero."
    },
    {
        id: 48,
        category: "backend",
        question: "¿Qué ventaja ofrece LINQ frente a escribir SQL tradicional para un desarrollador de C#?",
        answer: "Permite detectar errores de sintaxis y tipos en tiempo de compilación en lugar de esperar a la ejecución de la consulta.",
        codeExample: `// SQL tradicional (errores en runtime)
string sql = "SELECT * FROM Sensrs WHERE Activo = 1";
// Error: tabla "Sensrs" no existe
// Lo descubres cuando EJECUTAS ❌

// LINQ (errores en compilación)
var result = context.Sensors
    .Where(s => s.Activo)
    .ToList();
// Si 'Activo' no existe → Error INMEDIATO ✅
// Antes de ejecutar`,
        simpleExplanation: "📝 Es como escribir con corrector automático:\n\n**SQL tradicional**: Cuaderno\nEscribes \"Sensrs\" (error)\nLo entregas al profesor\nProfesor: \"Está mal\" ❌\n\n**LINQ**: Word con corrector\nEscribes \"Sensrs\"\nWord: \"¿Quisiste decir Sensors?\" inmediato ✅\n\n🎯 LINQ te dice \"Este campo no existe\" ANTES de ejecutar. SQL te lo dice CUANDO falla (en producción)."
    },
    {
        id: 49,
        category: "backend",
        question: "Concepto: Token JWT",
        answer: "Definición: Es un estándar para transmitir información de forma segura entre partes como un objeto JSON, usado comúnmente para autenticación.",
        codeExample: `// JWT = Pase digital

// Estructura:
{
  // Header
  "alg": "HS256",
  "typ": "JWT"
}
{
  // Payload (datos)
  "userId": 123,
  "role": "Admin",
  "exp": 1735689600
}
{
  // Signature (firma digital)
  // Asegura que no fue modificado
}

// Cliente lo envía en cada request:
Authorization: Bearer eyJhbGc...`,
        simpleExplanation: "🎫 JWT es como pase de concierto:\n\n**Login = Entrada del concierto**:\nMuestras ID → Te dan pulsera 🎫\n\n**Pulsera (JWT)**:\n- Tiene info: \"VIP, válido hasta medianoche\"\n- Firma del organizador (no se puede falsificar)\n\n**Cada área del concierto**:\nMuestras pulsera → Dejan pasar ✅\nNo preguntan tu nombre cada vez\n\n🎯 En API: Login una vez → Recibes JWT → Lo envías en cada petición → API sabe quién eres sin consultar BD."
    },
    {
        id: 50,
        category: "backend",
        question: "¿Qué significa que un servicio sea registrado como 'Scoped' en .NET?",
        answer: "Significa que se crea una nueva instancia del servicio por cada solicitud HTTP recibida.",
        codeExample: `// Lifetimes en ASP.NET Core DI

// Scoped (lo más común)
services.AddScoped<ISensorService, SensorService>();
// Nueva instancia por cada HTTP request

// Transient
services.AddTransient<IEmailSender, EmailSender>();
// Nueva instancia cada vez que se inyecta

// Singleton
services.AddSingleton<ICache, MemoryCache>();
// UNA instancia para toda la aplicación`,
        simpleExplanation: "☕ Lifetimes son como servir café:\n\n**Scoped = Taza nueva por cliente**:\nCliente 1 → Taza limpia\nCliente 2 → Taza nueva limpia\n(Lo más común)\n\n**Transient = Taza nueva por cada trago**:\nSorbo 1 → Taza\nSorbo 2 → Taza nueva\n(Costoso)\n\n**Singleton = Termo compartido**:\nTODOS toman del mismo termo\n(Para cosas globales)\n\n🎯 En invernaderos: SensorService era Scoped - nueva instancia por request HTTP."
    },
    {
        id: 51,
        category: "backend",
        question: "¿Cuál es el objetivo de utilizar la lógica asíncrona (async/await) en el acceso a datos?",
        answer: "Evitar el bloqueo del hilo principal de ejecución mientras se espera la respuesta de la base de datos, mejorando la escalabilidad.",
        codeExample: `// Sin async (bloqueante)
public List<Sensor> GetAll() {
    var result = context.Sensors.ToList();
    // Thread BLOQUEADO esperando BD
    // No puede atender otras requests
    return result;
}

// Con async (no bloqueante)
public async Task<List<Sensor>> GetAllAsync() {
    var result = await context.Sensors.ToListAsync();
    // Thread LIBERADO para otras requests
    // Regresa cuando BD responde
    return result;
}`,
        simpleExplanation: "🍳 Es como cocinar:\n\n**Sin async (bloqueante)**:\nPones agua a hervir → Te quedas mirando 10 minutos → Hierve → Sigues cocinando\n\n**Con async (no bloqueante)**:\nPones agua a hervir → Mientras, picas verduras → Agua lista → Vuelves\n\n🎯 En servidor: Sin async, 1 request tarda 1s = 1 request/segundo. Con async, mientras espera BD, atiende otro request = 100 requests/segundo."
    },
    {
        id: 52,
        category: "backend",
        question: "¿Cómo se asegura la comunicación entre un equipo IoT en México y un equipo Backend en Bolivia?",
        answer: "Mediante comunicación asíncrona en Slack, videollamadas para bloqueos y documentación rigurosa de APIs en Postman.",
        codeExample: `// Estrategia de comunicación remota

1. Daily async en Slack
   - Qué hice ayer
   - Qué haré hoy
   - Bloqueos

2. Postman Collections compartidas
   - Equipo IoT: "Así enviaremos datos"
   - Equipo Backend: "Así los recibiremos"

3. Videollamadas solo para:
   - Decisiones arquitectónicas
   - Problemas bloqueantes
   - Code reviews importantes`,
        simpleExplanation: "🌎 Trabajo remoto internacional:\n\n**Problema**: México vs Bolivia = 1-2 horas de diferencia\n\n**Solución**:\n📱 **Slack**: Conversaciones asíncronas\n- \"Terminé el endpoint X\"\n- Responden cuando pueden\n\n📹 **Videollamadas**: Solo urgente\n- \"El endpoint no funciona, necesito ayuda YA\"\n\n📚 **Postman**: Documentación viva\n- IoT sabe cómo enviar datos\n- Backend sabe qué esperar\n\n🎯 Real: Raras veces necesitábamos videollamadas. Postman + Slack eran suficientes."
    },
    {
        id: 53,
        category: "frontend",
        question: "¿Qué es un 'Mock Service' en el desarrollo frontend?",
        answer: "Es un servicio que simula datos reales para permitir el desarrollo de la interfaz de usuario antes de que el backend esté disponible.",
        codeExample: `// Mock Service en Angular
export class CourseService {
    getCourses(): Observable<Course[]> {
        // Datos falsos para desarrollo
        return of([
            { id: 1, name: 'Angular Básico' },
            { id: 2, name: 'RxJS Avanzado' }
        ]).pipe(delay(500)); // Simula latencia
    }
}

// Cuando backend esté listo:
// Solo cambias el return por: 
// return this.http.get<Course[]>('/api/courses')`,
        simpleExplanation: "🎭 Mock Service = Actor de reemplazo:\n\n**Película en filmación**:\nActor principal enfermo 🤒\n¿Paras toda la producción? ❌\nUsa doble de riesgo temporalmente ✅\n\n**Desarrollo frontend**:\nBackend no está listo 🔨\n¿Paras desarrollo? ❌\nUsas datos falsos temporalmente ✅\n\n🎯 En CayudiApp: Frontend avanzó semanas antes que backend. Usamos datos mock, luego solo cambiamos a API real."
    },
    {
        id: 54,
        category: "backend",
        question: "¿Cuál es la función del archivo DbContext en Entity Framework?",
        answer: "Actúa como el puente principal entre el código de la aplicación y la base de datos, gestionando las sesiones y entidades.",
        codeExample: `// DbContext = Representante de la BD
public class AppDbContext : DbContext {
    // Tablas disponibles
    public DbSet<Sensor> Sensors { get; set; }
    public DbSet<Reading> Readings { get; set; }
    
    // Configuración
    protected override void OnModelCreating(
        ModelBuilder builder) {
        // Relaciones, constraints, índices...
    }
    
    // Conexión a BD
    protected override void OnConfiguring(
        DbContextOptionsBuilder options) {
        options.UseSqlServer(connectionString);
    }
}`,
        simpleExplanation: "🌉 DbContext es el puente entre dos mundos:\n\n**Mundo C#**: Objetos, clases, LINQ\n↕️\n**DbContext**: Traductor 🗣️\n↕️\n**Mundo SQL**: Tablas, filas, SQL\n\n**Sin DbContext**: Necesitas hablar SQL directamente 😰\n\n**Con DbContext**: Hablas C#, él traduce a SQL automáticamente 😊\n\n🎯 Es como usar Google Translate - conecta dos idiomas que no se entienden entre sí."
    },
    {
        id: 55,
        category: "ml",
        question: "¿Por qué se eliminaron usuarios con menos de 200 ratings en el proyecto de Machine Learning?",
        answer: "Para asegurar la significancia estadística y reducir el ruido en el modelo de recomendación.",
        codeExample: `// Filtrado de datos

# Dataset original
usuarios: 278,858
ratings: 1,149,780

# Filtrado:
# - Usuarios con < 200 ratings: FUERA
# - Libros con < 100 ratings: FUERA

# Dataset final
usuarios: 888  (solo activos)
ratings: 49,781  (alta calidad)

# Sacrificas cantidad por CALIDAD`,
        simpleExplanation: "📊 Es como encuesta de restaurante:\n\n**Usuario con 5 reseñas**:\n- 2 buenas, 3 malas\n- ¿Patrón real? 🤷 No confiable\n\n**Usuario con 200 reseñas**:\n- 120 buenas, 80 malas\n- Patrón claro: Le gustan ciertos tipos 📈\n\n🎯 Usuario que leyó 5 libros → Opinión poco confiable\nUsuario que leyó 200+ libros → Tiene gustos claros\n\nPreferimos 888 usuarios confiables que 278K usuarios ruidosos."
    },
    {
        id: 56,
        category: "backend",
        question: "¿Qué es .NET MAUI con Blazor Hybrid?",
        answer: "Es una tecnología que permite usar componentes web de Blazor para crear aplicaciones nativas de escritorio y móviles con un solo código.",
        codeExample: `// Un código, múltiples plataformas

// Componente Blazor .razor
<h1>Hello @Platform</h1>
<button @onclick="ShowAlert">Click</button>

// Se ejecuta en:
✅ Windows (escritorio)
✅ macOS (escritorio)
✅ iOS (móvil)
✅ Android (móvil)

// Mismo código, apariencia nativa`,
        simpleExplanation: "📱 MAUI + Blazor = Un traductor universal:\n\n**Problema**: Escribir 4 apps diferentes\n- Windows: C# WPF\n- Mac: Swift\n- iOS: Swift\n- Android: Kotlin\n😰 4 códigos diferentes\n\n**MAUI + Blazor**: Un código\nEscribes componentes Blazor una vez\n→ MAUI los adapta a cada plataforma\n😊 1 código para 4 plataformas\n\n🎯 AutoPartes: Código web funciona en Windows, Mac, iOS, Android sin cambios."
    },
    {
        id: 57,
        category: "backend",
        question: "¿Para qué sirve el comando 'Add-Migration' en EF Core?",
        answer: "Genera un archivo de código que describe los cambios necesarios en la base de datos para reflejar las modificaciones en las clases de C#.",
        codeExample: `// Workflow de migrations

// 1. Modificas entidad en C#
public class Sensor {
    public string Name { get; set; }
    public string Location { get; set; }  // NUEVO
}

// 2. Generas migration
Add-Migration AddLocationToSensor

// 3. EF Core genera clase con Up/Down
public void Up() {
    AddColumn("Sensors", "Location", ...);
}

// 4. Aplicas a BD
Update-Database`,
        simpleExplanation: "📝 Migrations son como recetas de cambios:\n\n**Problema**: BD en producción tiene datos\nNo puedes simplemente recrearla ❌\n\n**Migration = Receta de cambio**:\n\"Paso 1: Agrega columna Location\"\n\"Paso 2: Copia datos de campo antiguo\"\n\"Paso 3: Elimina campo antiguo\"\n\n**Deshacer**:\nMigration tiene \"receta inversa\"\n\n🎯 Es como instrucciones IKEA - paso a paso, reversible si algo sale mal."
    },
    {
        id: 58,
        category: "backend",
        question: "¿Qué es un 'NullReferenceException' y cómo ayuda la DI a evitarlo?",
        answer: "Es un error que ocurre al intentar acceder a un objeto nulo; la DI lo previene asegurando que todas las dependencias requeridas se inyecten al crear la clase.",
        codeExample: `// Sin DI (peligro)
public class Service {
    private IRepo _repo;  // null!
    
    public void DoSomething() {
        _repo.Save();  // 💥 NullReferenceException
    }
}

// Con DI (seguro)
public class Service {
    private readonly IRepo _repo;
    
    public Service(IRepo repo) {
        _repo = repo ?? throw new ArgumentNullException();
    }
    // Si repo es null → Falla AL CREAR
    // No cuando el usuario usa la app
}`,
        simpleExplanation: "🔧 NullReferenceException = Usar herramienta que no tienes:\n\n**Sin DI**:\nIntentasatornillar\n\"¿Dónde está el destornillador?\" 🤷\nNo tienes ninguno 💥\n(Error cuando ya estás trabajando)\n\n**Con DI**:\nAntes de empezar:\n\"¿Tienes destornillador?\" \n\"No\" → \"No puedes empezar\" ✅\n(Error ANTES de trabajar)\n\n🎯 Con DI, si falta un servicio, la app ni arranca. Mejor que falle temprano."
    },
    {
        id: 59,
        category: "frontend",
        question: "¿Qué significa 'lazy loading' en el contexto de Angular?",
        answer: "Es una técnica que carga los módulos de la aplicación solo cuando el usuario navega hacia ellos, optimizando el tiempo de carga inicial.",
        codeExample: `// Sin lazy loading (malo)
// bundle.js = 2MB
// Usuario espera 10s para ver login

// Con lazy loading (bueno)
const routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard')
            .then(m => m.DashboardModule)
    }
];

// Carga inicial: 50KB (login)
// Dashboard: 200KB (solo cuando navega)`,
        simpleExplanation: "📚 Lazy loading = No cargar todos los libros:\n\n**Sin lazy loading**:\nVas a biblioteca\nLlevas TODOS los libros a tu mesa 📚📚📚\n(Tardas 10 minutos cargando)\n\n**Con lazy loading**:\nLlevas solo el libro que leerás ahora 📕\nCuando termines, traes el siguiente 📗\n(Empiezas en 30 segundos)\n\n🎯 En CayudiApp: Login carga rápido. Dashboard se carga solo cuando entras al dashboard."
    },
    {
        id: 60,
        category: "backend",
        question: "¿Cuál es la diferencia entre un 'Index Seek' y un 'Index Scan'?",
        answer: "Un Seek va directamente a la ubicación del dato usando el índice, mientras que un Scan recorre todo el índice, siendo el Seek mucho más rápido.",
        codeExample: `// Plan de ejecución en SSMS

// Index Seek (óptimo) ✅
→ Usa índice
→ Va directo a filas necesarias
→ Cost: 5%

// Index Scan (subóptimo) 😐
→ Usa índice
→ Recorre TODO el índice
→ Cost: 45%

// Table Scan (pésimo) ❌
→ NO usa índice
→ Recorre TODA la tabla
→ Cost: 95%`,
        simpleExplanation: "🔍 Buscar tu auto en estacionamiento:\n\n**Index Seek (mejor)** 🎯:\nApp dice: \"Fila B, Posición 12\"\nVas directo → 30 segundos\n\n**Index Scan (regular)** 🚶:\nTienes mapa del estacionamiento\nRecorres fila por fila mirando mapa\n→ 5 minutos\n\n**Table Scan (pésimo)** 🏃:\nSin mapa, revisas TODO\nAuto por auto\n→ 30 minutos\n\n🎯 Objetivo: Seek. Si ves Scan en plan de ejecución, necesitas mejor índice."
    },
    {
        id: 61,
        category: "backend",
        question: "¿Por qué el backend del proyecto de invernaderos era una Web API pura sin vistas Razor o cshtml?",
        answer: "Porque el frontend era una aplicación separada en Angular que consumía los endpoints REST. El backend solo devolvía JSON, no HTML.",
        codeExample: `// Web API pura: solo JSON
[HttpGet]
public async Task<IActionResult> GetSensors() {
    var sensors = await _service.GetAllAsync();
    return Ok(sensors); // → JSON, nunca HTML
}

// NO existía esto en el proyecto:
// return View(sensors); ← MVC con Razor
// return Page();        ← Razor Pages

// ¿Por qué?
// Angular consumía el JSON
// y renderizaba las vistas él mismo`,
        simpleExplanation: "🍽️ Restaurante con cocina separada del comedor:\n\n**Web API pura**:\nCocina (backend) → prepara comida (JSON)\nMesero (Angular) → la lleva y sirve al cliente\n\n❌ La cocina NO decora los platos (HTML)\n✅ La cocina solo cocina\n✅ El mesero presenta el plato\n\n🎯 Real: Documentar en Postman era esencial porque había un equipo Angular separado que consumía la API. Si el backend generara vistas, no necesitarías documentar para nadie."
    },
    {
        id: 62,
        category: "frontend",
        question: "¿Qué framework de frontend consumía los endpoints REST del sistema de invernaderos y por qué era una elección natural en 2020?",
        answer: "Angular, porque en 2020 era el framework estándar para dashboards empresariales con backend en .NET, y Microsoft tenía templates oficiales de ASP.NET Core con Angular integrado.",
        codeExample: `// Template oficial Microsoft en 2020
dotnet new angular

// Generaba:
├── ClientApp/          ← Angular
│   ├── src/
│   │   ├── app/
│   │   └── environments/
└── Controllers/        ← ASP.NET Core API
    └── WeatherForecastController.cs

// Angular 9 lanzado: Febrero 2020
// Angular 10 lanzado: Junio 2020
// Versión activa durante el proyecto`,
        simpleExplanation: "🤝 Angular + .NET en 2020 era matrimonio natural:\n\n**¿Por qué Angular?**\n- Microsoft tenía template oficial ASP.NET Core + Angular\n- Angular 9/10 estaba en su punto más maduro\n- Dashboard con datos en tiempo real → Angular ideal\n- Tipado fuerte (TypeScript) = Menos errores\n\n**¿Por qué no React o Vue?**\n- El stack del equipo era Microsoft\n- Angular encajaba perfectamente con ese ecosistema\n\n🎯 Mi primer contacto real con Angular fue en ese proyecto viendo cómo el equipo frontend consumía los endpoints que yo construía."
    },
    {
        id: 63,
        category: "frontend",
        question: "¿Qué es HttpClient de Angular y cómo se usaba para consumir los endpoints del backend?",
        answer: "Es el módulo de Angular para hacer peticiones HTTP. Devuelve Observables de RxJS y se inyecta como dependencia en los servicios de Angular.",
        codeExample: `// Servicio Angular consumiendo el backend
@Injectable({ providedIn: 'root' })
export class ReadingService {
  constructor(private http: HttpClient) {}

  getReadings(
    sensorId: number,
    from: string,
    to: string
  ): Observable<ReadingDto[]> {
    const params = new HttpParams()
      .set('sensorId', sensorId)
      .set('from', from)
      .set('to', to);

    return this.http.get<ReadingDto[]>(
      '/api/readings',
      { params }
    );
  }
}`,
        simpleExplanation: "📞 HttpClient es el teléfono de Angular:\n\n**Sin HttpClient**: Angular no puede hablar con el backend\n\n**Con HttpClient**:\nAngular llama al backend → Backend responde con JSON → Angular recibe el dato\n\n**¿Por qué devuelve Observable y no el dato directo?**\nPorque HTTP es asíncrono — el dato no llega instantáneo, llega cuando el servidor responde.\n\n🎯 Es como pedir pizza: no la tienes ahora, te avisarán cuando llegue (Observable se activa cuando llega la respuesta)."
    },
    {
        id: 64,
        category: "frontend",
        question: "¿Qué es un HTTP Interceptor en Angular y para qué servía en el proyecto de invernaderos?",
        answer: "Es un mecanismo que intercepta todas las peticiones HTTP salientes para agregarles automáticamente el token de autorización sin que cada servicio lo haga manualmente.",
        codeExample: `// HTTP Interceptor con token
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set(
          'Authorization',
          \`Bearer \${token}\`
        )
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}

// Resultado en cada petición:
// GET /api/readings
// Authorization: Bearer eyJhbGc...`,
        simpleExplanation: "🔑 El Interceptor es como un asistente que firma todos tus documentos:\n\n**Sin Interceptor**:\nCada servicio Angular debe agregar el token manualmente → 20 servicios = 20 lugares donde poner el token 😰\n\n**Con Interceptor**:\nUn solo lugar intercepta TODAS las peticiones → Agrega el token automáticamente a todas 😊\n\n🎯 En invernaderos: El dashboard tenía múltiples servicios (sensores, lecturas, usuarios). El Interceptor enviaba el token de Identity en todos sin repetir código."
    },
    {
        id: 65,
        category: "frontend",
        question: "¿Cómo consumía Angular el endpoint de historial de lecturas con filtros de fecha?",
        answer: "Usando HttpClient con HttpParams para construir los query params, recibiendo un Observable que se suscribía en el componente para actualizar la vista.",
        codeExample: `// Servicio: construye la petición
getReadings(sensorId: number, from: string, to: string) {
  const params = new HttpParams()
    .set('sensorId', sensorId)
    .set('from', from)
    .set('to', to);
  return this.http.get<Reading[]>('/api/readings', { params });
  // Resultado: GET /api/readings?sensorId=5&from=2020-06-01&to=2020-06-30
}

// Componente: se suscribe y actualiza la vista
this.readingService.getReadings(5, '2020-06-01', '2020-06-30')
  .subscribe(readings => {
    this.readings = readings; // Vista se actualiza automáticamente
  });`,
        simpleExplanation: "🔄 El flujo completo era:\n\n1️⃣ Técnico selecciona sensor y fechas en el formulario Angular\n2️⃣ Componente llama al servicio Angular\n3️⃣ Servicio construye URL: /api/readings?sensorId=5&from=...\n4️⃣ HttpClient hace el GET a nuestro backend .NET\n5️⃣ Backend filtra con LINQ (con índice compuesto)\n6️⃣ Devuelve JSON con lecturas\n7️⃣ Angular recibe el Observable\n8️⃣ Vista se actualiza con los datos en tabla/gráfica\n\n🎯 Mi trabajo era garantizar los pasos 4-6. Los pasos 1-3 y 7-8 eran del equipo frontend."
    },
    {
        id: 66,
        category: "frontend",
        question: "¿Cómo consumía Angular el CRUD de sensores? ¿Qué verbo HTTP usaba para cada operación?",
        answer: "GET para consultar, POST para crear, PUT para actualizar y DELETE o PATCH para desactivar, todos desde servicios Angular con HttpClient.",
        codeExample: `// Servicio Angular - CRUD de Sensores
@Injectable({ providedIn: 'root' })
export class SensorService {
  private url = '/api/sensors';

  // READ: Lista de sensores
  getAll(): Observable<SensorDto[]> {
    return this.http.get<SensorDto[]>(this.url);
  }

  // CREATE: Crear sensor nuevo
  create(dto: CreateSensorDto): Observable<SensorDto> {
    return this.http.post<SensorDto>(this.url, dto);
  }

  // UPDATE: Actualizar rangos
  update(id: number, dto: UpdateSensorDto): Observable<SensorDto> {
    return this.http.put<SensorDto>(\`\${this.url}/\${id}\`, dto);
  }

  // DELETE: Desactivar sensor
  delete(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.url}/\${id}\`);
  }
}`,
        simpleExplanation: "📋 Cada acción del administrador en el dashboard disparaba un verbo HTTP:\n\n🟢 **Ver tabla de sensores** → GET /api/sensors\n🔵 **Formulario nuevo sensor** → POST /api/sensors\n🟡 **Editar rangos de temperatura** → PUT /api/sensors/5\n🔴 **Desactivar sensor** → DELETE /api/sensors/5\n\nAngular enviaba el token en todos via Interceptor.\nNuestro backend validaba el rol Admin antes de ejecutar cada uno.\n\n🎯 Mi parte: Garantizar que cada endpoint respondiera el JSON correcto. La parte Angular era del equipo frontend."
    },
    {
        id: 67,
        category: "backend",
        question: "¿Qué es FIWARE Orion Context Broker y qué rol cumplía en el sistema de invernaderos?",
        answer: "Es una plataforma IoT de código abierto que centraliza y normaliza datos de sensores en un formato estándar llamado NGSIv2, exponiendo una API REST que nuestro backend consumía.",
        codeExample: `// FIWARE en el flujo del sistema

Sensor físico → Cloudino → FIWARE Orion
                                ↓
                    API REST (NGSIv2)
                    GET /v2/entities?type=Sensor
                                ↓
                    {
                      "id": "Sensor:001",
                      "type": "Sensor",
                      "temperature": { "value": 28.5 },
                      "humidity": { "value": 65.2 },
                      "dateObserved": { "value": "2020-06-15T14:00:00Z" }
                    }
                                ↓
                    Nuestro backend consumía esto
                    y lo persistía en SQL Server`,
        simpleExplanation: "🌐 FIWARE era el intermediario universal:\n\n**Problema sin FIWARE**:\n50 sensores de 5 marcas diferentes\nCada uno habla su propio idioma 😰\n\n**FIWARE como traductor**:\nSensor A habla inglés ↘\nSensor B habla chino  → FIWARE → Todos hablan español (NGSIv2)\nSensor C habla árabe ↗\n\n🎯 El equipo IoT en México configuró FIWARE. Yo consumía la API de FIWARE desde el backend — ya no me preocupaba cómo hablaba cada sensor, todo llegaba normalizado."
    },
    {
        id: 68,
        category: "backend",
        question: "¿Qué es Cloudino y qué función cumplía en la arquitectura IoT del sistema?",
        answer: "Es un dispositivo basado en Arduino con conectividad WiFi que digitalizaba las señales de los sensores físicos y las enviaba a FIWARE Orion.",
        codeExample: `// Flujo con Cloudino

Temperatura ambiente (señal física)
        ↓
  Sensor físico
  (termistor, sonda, etc.)
        ↓
   [CLOUDINO]
   (Arduino + WiFi)
   - Lee señal analógica del sensor
   - Convierte a valor digital (ej: 28.5°C)
   - Envía via HTTP/MQTT a FIWARE
        ↓
  FIWARE Orion
  (ya normalizado)
        ↓
  Nuestro backend .NET`,
        simpleExplanation: "🌡️ Cloudino era el traductor físico-digital:\n\n**El problema**:\nUn sensor de temperatura es solo un cable que cambia su resistencia eléctrica con el calor.\nEl internet no entiende de resistencias eléctricas 😅\n\n**Cloudino**:\n\"La resistencia cambió → Eso equivale a 28.5°C → Lo envío como JSON a FIWARE\"\n\n🎯 Era el hardware que conectaba el mundo físico (calor, humedad) con el mundo digital (nuestra API). Yo no lo configuré — era responsabilidad del equipo IoT en México."
    },
    {
        id: 69,
        category: "backend",
        question: "¿Qué es el formato NGSIv2 y por qué era importante para el consumo de la API de FIWARE?",
        answer: "Es el formato estándar de datos de FIWARE que normaliza la información de sensores en JSON estructurado, independientemente del fabricante del sensor.",
        codeExample: `// Respuesta típica de FIWARE en NGSIv2
{
  "id": "Sensor:Invernadero-A-001",
  "type": "TemperatureSensor",
  "temperature": {
    "type": "Number",
    "value": 28.5,
    "metadata": {}
  },
  "humidity": {
    "type": "Number",
    "value": 65.2,
    "metadata": {}
  },
  "dateObserved": {
    "type": "DateTime",
    "value": "2020-06-15T14:30:00Z"
  }
}

// Nuestro backend deserializaba esto
// a clases C# para persistir en SQL Server`,
        simpleExplanation: "📋 NGSIv2 era el formulario estándar:\n\n**Sin estándar**:\nEmpresa A reporta: \"temp:28\"\nEmpresa B reporta: \"T_celsius=28.5\"\nEmpresa C reporta: \"temperature_reading: 28.50°C\"\nTu código: 😵‍💫\n\n**Con NGSIv2**:\nTodas reportan:\n{ \"temperature\": { \"value\": 28.5 } }\nTu código: 😊 Siempre igual\n\n🎯 Yo deserializaba ese JSON a clases C# en el backend. Si FIWARE cambiaba el formato, solo ajustaba el DTO externo — el resto del sistema no se enteraba."
    },
    {
        id: 70,
        category: "backend",
        question: "¿Qué es IHttpClientFactory y por qué se usaba en lugar de instanciar HttpClient con 'new' directamente?",
        answer: "Es una fábrica que gestiona un pool de conexiones HTTP reutilizables, evitando el problema de socket exhaustion que ocurre al crear y destruir HttpClient constantemente.",
        codeExample: `// ❌ PROBLEMA: new HttpClient() directo
public class FiwareClient {
    public async Task<string> GetData() {
        using var client = new HttpClient(); // Nueva instancia
        return await client.GetStringAsync(url);
        // Al salir del using: cierra el socket
        // Con muchas peticiones: se agotan los sockets
        // Socket exhaustion 💥
    }
}

// ✅ SOLUCIÓN: IHttpClientFactory
public class FiwareClient {
    private readonly HttpClient _client;
    
    public FiwareClient(HttpClient client) {
        _client = client; // Pool administrado
    }
    
    public async Task<string> GetData() {
        return await _client.GetStringAsync(url);
        // Reutiliza conexiones del pool 😊
    }
}

// En Startup.cs:
services.AddHttpClient<IFiwareClient, FiwareClient>(client => {
    client.BaseAddress = new Uri(config["Fiware:BaseUrl"]);
});`,
        simpleExplanation: "🚿 Es como el agua de la ducha:\n\n**new HttpClient() (malo)**:\nAbres grifo → usas agua → cierras grifo (pero el tubo queda bloqueado 10s)\nMuchas personas haciendo esto → Se bloquean todos los tubos 😰\n= Socket exhaustion\n\n**IHttpClientFactory (bueno)**:\nHay un sistema central de agua\nGestiona las tuberías inteligentemente\nReutiliza conexiones en lugar de crear nuevas\n😊 Nunca se agotan los tubos\n\n🎯 En invernaderos: El proceso de polling a FIWARE hacía muchas peticiones. Sin IHttpClientFactory, habríamos agotado los sockets del servidor."
    },
    {
        id: 71,
        category: "backend",
        question: "¿Cómo se registraba y usaba IHttpClientFactory en el proyecto para consumir la API de FIWARE?",
        answer: "Se registraba en Startup.cs con AddHttpClient<T>, configurando la URL base de FIWARE, y se inyectaba automáticamente en el cliente tipado via DI.",
        codeExample: `// 1. Registro en Startup.cs
services.AddHttpClient<IFiwareClient, FiwareClient>(client => {
    client.BaseAddress = new Uri(configuration["Fiware:BaseUrl"]);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

// 2. Cliente tipado
public class FiwareClient : IFiwareClient {
    private readonly HttpClient _httpClient;
    
    public FiwareClient(HttpClient httpClient) {
        _httpClient = httpClient;
    }
    
    public async Task<List<SensorReadingDto>> GetLatestReadingsAsync() {
        var response = await _httpClient.GetAsync("/v2/entities?type=Sensor");
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<List<SensorReadingDto>>(json);
    }
}

// 3. Inyectado en el Service via DI
public class ReadingIngestionService {
    private readonly IFiwareClient _fiwareClient;
    
    public ReadingIngestionService(IFiwareClient fiwareClient) {
        _fiwareClient = fiwareClient;
    }
}`,
        simpleExplanation: "🔗 Todo conectado con DI:\n\n1️⃣ **Startup.cs**: Registras FiwareClient con URL de FIWARE\n2️⃣ **FiwareClient**: Recibe HttpClient por constructor (DI)\n3️⃣ **ReadingIngestionService**: Recibe IFiwareClient por constructor (DI)\n\nEl contenedor de DI gestiona todo el ciclo de vida.\n\n🎯 Esto conecta directamente con el bullet de DI en tu CV — IHttpClientFactory es parte del mismo contenedor que registraba Services y Repositories. Todo el sistema compartía el mismo patrón."
    },
    {
        id: 72,
        category: "backend",
        question: "¿Cómo funcionaba el proceso de polling que traía datos de FIWARE al sistema?",
        answer: "Un proceso ejecutaba periódicamente llamadas a la API de FIWARE, deserializaba el JSON NGSIv2 a DTOs internos, y los persistía en SQL Server via el Repository.",
        codeExample: `// Proceso de ingesta periódica
public class ReadingIngestionService {
    private readonly IFiwareClient _fiwareClient;
    private readonly IReadingRepository _repo;
    
    public async Task IngestLatestReadingsAsync() {
        // 1. Consulta FIWARE
        var fiwareReadings = await _fiwareClient.GetLatestReadingsAsync();
        
        // 2. Transforma DTO externo → entidad interna
        var readings = fiwareReadings.Select(fr => new Reading {
            SensorId   = ResolveSensorId(fr.Id),
            Temperature = fr.Temperature.Value,
            Humidity    = fr.Humidity.Value,
            Timestamp   = fr.DateObserved.Value
        }).ToList();
        
        // 3. Persiste en SQL Server
        await _repo.AddRangeAsync(readings);
    }
}

// FLUJO:
// FIWARE API → DTO externo → Entidad → SQL Server
// (El DTO externo aísla el formato NGSIv2
//  del resto del sistema)`,
        simpleExplanation: "📦 Era como un empleado de recepción:\n\n1️⃣ Cada X minutos: Llama a FIWARE (pregunta si hay paquetes nuevos)\n2️⃣ FIWARE responde con JSON NGSIv2 (lista de paquetes)\n3️⃣ El proceso convierte ese JSON a nuestras entidades internas (abre y re-empaca los paquetes)\n4️⃣ Guarda en SQL Server (archiva en bodega)\n\n🎯 El DTO externo (NGSIv2) era clave: Si FIWARE cambiaba su formato, solo cambiaba el DTO externo. El Repository, el Service, el endpoint de lecturas — todo lo demás seguía igual."
    },
    {
        id: 73,
        category: "backend",
        question: "¿Por qué las Lecturas (Readings) no tenían operaciones Update ni Delete en el CRUD del sistema?",
        answer: "Porque son datos históricos reales — si un sensor registró 38°C en un momento dado, ese dato ocurrió. Modificarlo o eliminarlo comprometería la integridad del historial.",
        codeExample: `// Entidades y sus operaciones disponibles

// Sensor: CRUD completo (administrable)
POST   /api/sensors          ✅ Crear
GET    /api/sensors          ✅ Consultar
PUT    /api/sensors/{id}     ✅ Actualizar rangos
DELETE /api/sensors/{id}     ✅ Desactivar

// Reading: Solo CR (dato histórico)
POST   /api/readings         ✅ Crear (proceso FIWARE)
GET    /api/readings         ✅ Consultar historial
PUT    /api/readings/{id}    ❌ No existe (¿editar historia?)
DELETE /api/readings/{id}    ❌ No existe (¿borrar realidad?)

// Principio: inmutabilidad de datos de auditoría`,
        simpleExplanation: "📜 Las lecturas son como el registro histórico del tiempo:\n\n**El noticiario dice**: \"Ayer hizo 38°C en Cochabamba\"\n¿Puedes ir al noticiero y cambiar ese dato a 25°C? ❌\n¿Puedes pedirle que lo borre? ❌\nYa ocurrió — es historia.\n\n**Las lecturas de sensor son iguales**:\n- El sensor registró 38°C a las 14:00 ✅ → Dato real\n- Editarlo → Historial corrupto ❌\n- Borrarlo → Pérdida de datos ❌\n\n🎯 Esto también simplificaba el código: el Repository de Readings solo necesitaba AddAsync y las queries de LINQ con filtros."
    },
    {
        id: 74,
        category: "backend",
        question: "¿Cómo se integraba SignalR con Angular en el proyecto de invernaderos?",
        answer: "El backend tenía un Hub de SignalR y Angular usaba la librería oficial @microsoft/signalr (disponible en npm) para conectarse y recibir actualizaciones en tiempo real.",
        codeExample: `// BACKEND: Hub en ASP.NET Core 3.1
public class ReadingsHub : Hub {
    public async Task SendReading(ReadingDto reading) {
        await Clients.All.SendAsync("ReceiveReading", reading);
    }
}

// En Startup.cs:
services.AddSignalR();
app.UseEndpoints(endpoints => {
    endpoints.MapHub<ReadingsHub>("/hubs/readings");
});

// FRONTEND: Angular con @microsoft/signalr
// npm install @microsoft/signalr

import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
    .withUrl('/hubs/readings')
    .withAutomaticReconnect()  // Si pierde conexión, reconecta solo
    .build();

connection.on('ReceiveReading', (reading: ReadingDto) => {
    // Angular actualiza la vista automáticamente
    this.readings.unshift(reading);
});

await connection.start();`,
        simpleExplanation: "📡 Era como una suscripción a notificaciones:\n\n**Sin SignalR**:\nAngular pregunta cada 5s: \"¿Hay datos?\"\nServidor: \"No... No... No... Sí!\"\n→ 11 peticiones innecesarias 😰\n\n**Con SignalR**:\nAngular: \"Me suscribo a ReceiveReading\"\nServidor: ... (silencio) ...\nLlega lectura nueva\nServidor: \"¡Oye Angular, llegó esto!\"\nAngular: recibe y actualiza la vista 😊\n\n🎯 El POC demostró que era técnicamente viable. Yo hice el Hub en el backend. El equipo frontend conectó Angular con @microsoft/signalr de npm."
    },
    {
        id: 75,
        category: "backend",
        question: "¿Cómo se manejaba el token de autenticación en la conexión de SignalR con Angular?",
        answer: "El token JWT se enviaba como query parameter en la URL de conexión al Hub, ya que SignalR WebSockets no admite headers HTTP personalizados.",
        codeExample: `// Angular: Token en la conexión SignalR
const token = localStorage.getItem('token');

const connection = new signalR.HubConnectionBuilder()
    .withUrl('/hubs/readings', {
        // WebSockets no admite headers HTTP
        // El token va en la query string
        accessTokenFactory: () => token
    })
    .build();

// Resultado: wss://servidor/hubs/readings?access_token=eyJhbGc...

// BACKEND: Hub extrae el token automáticamente
// ASP.NET Core Identity lo valida
[Authorize]  // ← Protege el Hub
public class ReadingsHub : Hub { }`,
        simpleExplanation: "🔐 WebSockets y tokens tienen una peculiaridad:\n\n**HTTP normal**:\nPuedes enviar headers: Authorization: Bearer token ✅\n\n**WebSockets**:\nNo admite headers personalizados en la conexión inicial ❌\n\n**Solución de SignalR**:\nEnvía el token en la URL: wss://server/hub?access_token=... ✅\nEl servidor lo extrae automáticamente\nIdentity lo valida igual que un header\n\n🎯 Fue algo que descubrí trabajando en el POC — los WebSockets tienen restricciones que el HTTP normal no tiene."
    },
    {
        id: 76,
        category: "backend",
        question: "¿Por qué era crucial documentar los endpoints en Postman cuando había múltiples equipos (Backend, Frontend Angular, QA, IoT)?",
        answer: "Porque cada equipo dependía del contrato de la API para trabajar en paralelo. Postman era la fuente de verdad compartida que evitaba bloqueos entre equipos.",
        codeExample: `// Sin documentación → Bloqueos
Equipo Angular: "¿Qué campos devuelve /api/readings?"
Backend: "Pregúntale al senior que está en junta..."
Angular: 😴 (espera bloqueado)

// Con Postman Collections compartidas
// Colección: Invernadero API v1
├── Sensores
│   ├── GET /api/sensors         ← Ejemplo respuesta ✅
│   ├── POST /api/sensors        ← Body + respuesta ✅
│   └── PUT /api/sensors/{id}    ← Body + respuesta ✅
├── Lecturas
│   └── GET /api/readings        ← Params + respuesta ✅
└── Auth
    └── POST /api/auth/login     ← Body + token ✅

// Cada equipo consultaba Postman de forma independiente`,
        simpleExplanation: "📚 Postman era el diccionario compartido de 3 equipos:\n\n**Equipo Angular** (México):\n\"¿Qué devuelve /api/sensors?\"\n→ Mira Postman → Trabaja solo 😊\n\n**Equipo QA**:\n\"¿Cómo pruebo el login?\"\n→ Mira Postman → Prueba solo 😊\n\n**Equipo IoT**:\n\"¿Cómo está esperando el backend los datos?\"\n→ Mira Postman → Configura FIWARE 😊\n\n🎯 Sin Postman: Los 3 equipos me interrumpían constantemente. Con Postman: Trabajaban de forma autónoma. La documentación era el puente entre los 3 equipos distribuidos."
    },
    {
        id: 77,
        category: "backend",
        question: "¿Cómo respondía el backend cuando Angular enviaba un token con rol incorrecto para un endpoint protegido?",
        answer: "ASP.NET Core Identity devolvía automáticamente un 403 Forbidden. Angular debía manejar ese código para redirigir o mostrar un mensaje de acceso denegado.",
        codeExample: `// Backend: endpoint protegido por rol
[Authorize(Roles = "Admin")]
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteSensor(int id) {
    await _service.DeleteAsync(id);
    return NoContent(); // 204
}

// Si un Técnico llama a este endpoint:
// → Identity verifica el token
// → Ve que el rol es "Tecnico", no "Admin"
// → Responde: 403 Forbidden
// → Angular recibe el 403 en el Observable

// Angular maneja el error:
this.sensorService.delete(id).subscribe({
  next: () => console.log('Eliminado'),
  error: (err) => {
    if (err.status === 403) {
      // Redirige o muestra mensaje
      alert('No tienes permisos para esta acción');
    }
  }
});`,
        simpleExplanation: "🚦 El sistema de roles generaba respuestas claras:\n\n**401 Unauthorized**: No tienes token (no estás autenticado)\n→ Angular redirige al login\n\n**403 Forbidden**: Tienes token pero tu rol no alcanza\n→ Angular muestra \"Sin permisos\"\n\n**204 No Content**: Operación exitosa, sin datos que devolver\n→ Angular actualiza la lista\n\n🎯 Esto era el resultado de Identity + atributo [Authorize] en el backend + manejo de errores en el Observable de Angular. Los tres niveles trabajando juntos."
    },
    {
        id: 78,
        category: "backend",
        question: "¿Puedes describir el flujo completo del sistema de invernaderos, de punta a punta?",
        answer: "Desde el sensor físico pasando por Cloudino, FIWARE, el backend .NET y hasta el dashboard Angular, incluyendo el flujo de escritura, lectura y administración.",
        codeExample: `// ESCRITURA (automatizada):
Sensor físico
    → Cloudino (Arduino + WiFi)
    → FIWARE Orion (NGSIv2)
    → Backend: polling con IHttpClientFactory
    → DTO externo → entidad interna
    → ReadingRepository.AddAsync()
    → SQL Server

// LECTURA (técnico):
Angular HttpClient: GET /api/readings?sensorId=5&from=...
(token via HTTP Interceptor)
    → ReadingsController
    → ReadingService
    → ReadingRepository (LINQ + índice compuesto)
    → SQL Server → 200ms (antes: 8s)
    → Entidad → DTO → JSON
    → Angular Observable → tabla/gráfica

// ADMINISTRACIÓN (admin):
Angular: POST/PUT/DELETE /api/sensors
(token rol Admin via Interceptor)
    → SensorsController [Authorize(Roles="Admin")]
    → SensorService (validación negocio)
    → SensorRepository (EF Core)
    → SQL Server

// TIEMPO REAL (POC):
Nueva lectura llega al backend
    → ReadingsHub.SendReading()
    → @microsoft/signalr en Angular
    → Vista se actualiza sin recargar`,
        simpleExplanation: "🗺️ El mapa completo del sistema:\n\n**3 equipos, 1 sistema:**\n\n🤖 **Equipo IoT (México)**: Cloudino + FIWARE\n💻 **Yo (Bolivia)**: Backend .NET — el puente\n🖥️ **Equipo Frontend**: Dashboard Angular\n\n**El backend era el corazón**:\n- Recibía datos de FIWARE (via IHttpClientFactory)\n- Los guardaba en SQL Server (via EF Core + Repository)\n- Los exponía a Angular (via endpoints REST)\n- Los protegía (via Identity + roles)\n- Los entregaba rápido (via índices compuestos)\n- Los empujaba en tiempo real (via SignalR — POC)\n\n🎯 Cada bullet de tu CV era una pieza de este flujo completo."
    }
];
