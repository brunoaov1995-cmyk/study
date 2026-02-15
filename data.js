// Flashcards Data
const flashcardsData = [
    {
        id: 1,
        category: "backend",
        question: "¿Cuál era el propósito principal del sistema de control para invernaderos?",
        answer: "Monitorear datos de sensores físicos como temperatura, humedad y CO₂ para almacenarlos y permitir su consulta centralizada.",
        example: "💡 Ejemplo práctico: Imagina un invernadero con 50 sensores enviando datos cada 5 minutos. El sistema recibe, almacena y permite que técnicos y administradores consulten en tiempo real si las condiciones son óptimas para los cultivos."
    },
    {
        id: 2,
        category: "backend",
        question: "¿Cuáles eran las tres capas principales del sistema de monitoreo de invernaderos?",
        answer: "Una capa IoT de recolección de datos, una capa backend de procesamiento y una capa de visualización para los usuarios.",
        example: "🔧 En la práctica: Capa IoT (sensores en México) → Capa Backend (API en .NET Core en Bolivia) → Capa Web (Dashboard Angular para técnicos)"
    },
    {
        id: 3,
        category: "backend",
        question: "¿Por qué es desaconsejable incluir la lógica de negocio y el acceso a datos directamente en el Controller?",
        answer: "Porque mezcla responsabilidades y hace que el código sea extremadamente difícil de mantener ante cambios en reglas o bases de datos.",
        example: "❌ Malo: Controller que valida, accede a BD, aplica reglas y envía emails.\n✅ Bueno: Controller solo recibe HTTP → Service aplica reglas → Repository accede a BD."
    },
    {
        id: 4,
        category: "backend",
        question: "En una arquitectura por capas, ¿cuál es la responsabilidad exclusiva del Controller?",
        answer: "Recibir la petición HTTP, validar el formato básico del modelo y devolver la respuesta al cliente.",
        example: "📝 Código típico:\n[HttpGet(\"{id}\")]\npublic async Task<IActionResult> GetSensor(int id)\n{\n    var dto = await _sensorService.GetByIdAsync(id);\n    return Ok(dto);\n}"
    },
    {
        id: 5,
        category: "backend",
        question: "¿Qué tipo de lógica debe residir específicamente en la capa de Service?",
        answer: "La lógica de negocio pura, como determinar si un sensor está fuera de rango o gestionar registros duplicados.",
        example: "🎯 Ejemplo real del proyecto:\nif (reading.Temperature < minTemp || reading.Temperature > maxTemp)\n    await _notificationService.SendAlertAsync(\"Temperatura fuera de rango\");"
    },
    {
        id: 6,
        category: "backend",
        question: "¿Cuál es la única función que debe cumplir la capa de Repository?",
        answer: "Encargarse exclusivamente de la comunicación y las operaciones de lectura o escritura con la base de datos.",
        example: "💾 Repository típico:\npublic async Task<Sensor> GetByIdAsync(int id)\n{\n    return await _context.Sensors.FindAsync(id);\n}\n// NO contiene validaciones ni lógica de negocio"
    },
    {
        id: 7,
        category: "backend",
        question: "¿Qué ventaja ofrece separar el Repository si se decide cambiar el motor de base de datos?",
        answer: "Permite modificar solo la capa de persistencia sin que la capa de Service o la lógica de negocio se vean afectadas.",
        example: "🔄 Cambio real: SQL Server → PostgreSQL\n✅ Solo cambias el Repository y la configuración\n❌ Service, Controller y lógica de negocio no se tocan"
    },
    {
        id: 8,
        category: "backend",
        question: "Concepto: DTO (Data Transfer Object)",
        answer: "Definición: Una clase simple sin lógica ni comportamiento diseñada exclusivamente para transportar datos entre las capas del sistema.",
        example: "📦 Ejemplo:\npublic class UserDto\n{\n    public int Id { get; set; }\n    public string Email { get; set; }\n    public string Role { get; set; }\n    // NO tiene PasswordHash ni métodos"
    },
    {
        id: 9,
        category: "backend",
        question: "¿Por qué se utilizan DTOs para mejorar la seguridad de una API?",
        answer: "Para evitar la exposición de campos sensibles de las entidades de base de datos, como hashes de contraseñas o campos internos.",
        example: "🔒 Seguridad:\nEntidad User: Id, Email, PasswordHash, SecurityStamp, CreatedAt...\nDTO UserDto: Id, Email, Role\n→ El cliente NUNCA ve PasswordHash"
    },
    {
        id: 10,
        category: "backend",
        question: "¿Cómo ayudan los DTOs al desacoplamiento entre el cliente y la base de datos?",
        answer: "Permiten cambiar la estructura interna de las tablas sin romper el contrato o formato de datos que espera el cliente de la API.",
        example: "🔧 Cambio en BD: Renombras 'SensorName' → 'Name'\nCon DTO: El cliente sigue recibiendo 'name' sin problemas\nSin DTO: Rompes todos los clientes que usan 'SensorName'"
    },
    {
        id: 11,
        category: "backend",
        question: "¿Qué campos internos de ASP.NET Core Identity suelen ocultarse mediante el uso de DTOs?",
        answer: "Campos como PasswordHash, SecurityStamp y otros metadatos internos de gestión de usuarios.",
        example: "🛡️ Identity User tiene ~15 campos internos:\nPasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed...\nTú solo expones: Id, Email, Role"
    },
    {
        id: 12,
        category: "backend",
        question: "¿Cómo se realizaba el mapeo entre entidades y DTOs en el proyecto de invernaderos?",
        answer: "Se realizaba de forma manual en la capa de Service, asignando las propiedades campo por campo para mantener dependencias mínimas.",
        example: "🔄 Mapeo manual:\nvar dto = new SensorDto\n{\n    Id = entity.Id,\n    Name = entity.SensorName,\n    Type = entity.Type\n};\n// Simple pero verboso"
    },
    {
        id: 13,
        category: "backend",
        question: "¿En qué casos se suele preferir el mapeo manual sobre librerías como AutoMapper?",
        answer: "En proyectos de escala pequeña o mediana donde se busca mantener la simplicidad y evitar dependencias externas adicionales.",
        example: "⚖️ Decisión:\n- Proyecto pequeño (<20 entidades): Manual\n- Proyecto grande (>50 entidades): AutoMapper\nEn el proyecto de invernaderos: Manual fue suficiente"
    },
    {
        id: 14,
        category: "backend",
        question: "Concepto: Entity Framework Core (EF Core)",
        answer: "Definición: Es un ORM (Object-Relational Mapper) que permite interactuar con la base de datos utilizando objetos de C# en lugar de SQL.",
        example: "🔮 Magia del ORM:\nC#: context.Sensors.Where(s => s.Active).ToListAsync()\nSQL: SELECT * FROM Sensors WHERE Active = 1\nEF Core traduce automáticamente"
    },
    {
        id: 15,
        category: "backend",
        question: "En EF Core, ¿qué representa cada propiedad de tipo DbSet en el contexto de datos?",
        answer: "Representa una tabla específica de la base de datos con la que se pueden realizar operaciones de consulta y persistencia.",
        example: "📊 DbContext:\npublic DbSet<Sensor> Sensors { get; set; }\npublic DbSet<Reading> Readings { get; set; }\n→ Tablas 'Sensors' y 'Readings' en SQL Server"
    },
    {
        id: 16,
        category: "backend",
        question: "¿Qué método de EF Core se utiliza para persistir todos los cambios realizados en una sola transacción?",
        answer: "El método SaveChangesAsync().",
        example: "💾 Transacción:\ncontext.Sensors.Add(newSensor);\ncontext.Readings.Remove(oldReading);\nawait context.SaveChangesAsync();\n→ Ambos cambios o ninguno (atomicidad)"
    },
    {
        id: 17,
        category: "backend",
        question: "¿Qué es LINQ en el ecosistema de .NET?",
        answer: "Es una sintaxis declarativa integrada en C# que permite realizar consultas, filtrados y ordenamientos sobre colecciones de datos.",
        example: "📝 LINQ vs SQL:\nLINQ: readings.Where(r => r.Temperature > 25).OrderBy(r => r.Date)\nSQL: SELECT * FROM Readings WHERE Temperature > 25 ORDER BY Date"
    },
    {
        id: 18,
        category: "backend",
        question: "¿Cuándo es preferible escribir SQL directo o usar vistas en lugar de depender totalmente de EF Core?",
        answer: "Cuando el rendimiento es crítico y las consultas generadas por el ORM no son lo suficientemente eficientes para grandes volúmenes de datos.",
        example: "⚡ Caso real: Historial de 500K+ lecturas\nEF Core: 8 segundos\nSQL directo + índices: 200ms\n→ Para reportes complejos, SQL fue mejor"
    },
    {
        id: 19,
        category: "backend",
        question: "¿Cuál era la causa técnica de que las consultas de historial de sensores tardaran 8 segundos?",
        answer: "La base de datos realizaba un 'Full Table Scan' debido a la falta de índices adecuados para los filtros de búsqueda.",
        example: "🐌 Problema:\nQuery: WHERE SensorId = 5 AND Date BETWEEN '2020-01' AND '2020-02'\nSin índice: Revisa TODAS las filas (Table Scan)\nCon índice compuesto: Va directo a las filas (Index Seek)"
    },
    {
        id: 20,
        category: "backend",
        question: "¿Qué ocurre técnicamente durante un 'Full Table Scan' en SQL Server?",
        answer: "El motor de la base de datos debe revisar cada fila de la tabla una por una para encontrar los registros que coinciden con el filtro.",
        example: "🔍 Visualización:\nTabla con 500,000 filas\nTable Scan: Lee fila 1, 2, 3... hasta 500,000\nIndex Seek: Va directo a las ~1,000 filas relevantes"
    },
    {
        id: 21,
        category: "backend",
        question: "¿Qué solución se implementó para optimizar el filtrado por sensor y rango de fechas?",
        answer: "Se creó un índice compuesto que incluía las columnas SensorId y Timestamp de forma conjunta.",
        example: "⚡ SQL:\nCREATE NONCLUSTERED INDEX IX_Readings_Sensor_Date\nON Readings (SensorId, Timestamp DESC)\n→ Resultado: 8s → 200ms"
    },
    {
        id: 22,
        category: "backend",
        question: "¿Por qué se utilizó un índice compuesto en lugar de dos índices separados para el historial de sensores?",
        answer: "Porque las consultas siempre filtraban por ambos campos simultáneamente, permitiendo al motor ir directo a las filas relevantes.",
        example: "🎯 Query típica:\nWHERE SensorId = 5 AND Timestamp BETWEEN ...\n→ Índice compuesto (SensorId, Timestamp) es óptimo\nDos índices separados: SQL Server elige uno y luego filtra"
    },
    {
        id: 23,
        category: "backend",
        question: "¿Qué herramienta se utilizó para identificar el cuello de botella en las consultas SQL?",
        answer: "El plan de ejecución dentro de SQL Server Management Studio (SSMS).",
        example: "🔬 En SSMS:\n1. Ejecuta query con Ctrl+M (Include Execution Plan)\n2. Ves el plan gráfico\n3. Identificas: Table Scan (❌) vs Index Seek (✅)"
    },
    {
        id: 24,
        category: "backend",
        question: "Concepto: Dependency Injection (DI)",
        answer: "Definición: Patrón de diseño donde las dependencias de una clase se inyectan desde el exterior en lugar de que la clase las cree internamente.",
        example: "💉 Sin DI:\nclass Service {\n    private Repo _repo = new Repo(); // ❌\n}\n\nCon DI:\nclass Service {\n    private Repo _repo;\n    public Service(Repo repo) { _repo = repo; } // ✅\n}"
    },
    {
        id: 25,
        category: "backend",
        question: "¿Qué problema principal resuelve la Inyección de Dependencias respecto al acoplamiento?",
        answer: "Evita que las clases estén atadas a implementaciones concretas, facilitando el intercambio de componentes y la realización de pruebas unitarias.",
        example: "🧪 Testing:\nSin DI: No puedes cambiar Repo por MockRepo\nCon DI: services.AddScoped<IRepo, MockRepo>();\n→ Tests sin tocar base de datos real"
    },
    {
        id: 26,
        category: "backend",
        question: "¿Dónde se registran típicamente los servicios para la DI en una aplicación ASP.NET Core?",
        answer: "En la clase Startup.cs o Program.cs, utilizando métodos como services.AddScoped().",
        example: "⚙️ Program.cs:\nservices.AddScoped<ISensorService, SensorService>();\nservices.AddScoped<ISensorRepository, SensorRepository>();\n→ ASP.NET los inyecta automáticamente"
    },
    {
        id: 27,
        category: "backend",
        question: "¿Cómo ayuda el contenedor de DI a prevenir errores en tiempo de ejecución?",
        answer: "Permite detectar configuraciones incorrectas o dependencias faltantes al momento de arrancar la aplicación en lugar de cuando el usuario la usa.",
        example: "🚨 Error detectado al arrancar:\n\"Unable to resolve service for type 'ISensorService'\"\n→ Mejor que error en producción cuando usuario hace click"
    },
    {
        id: 28,
        category: "backend",
        question: "¿Qué funciones cumple ASP.NET Core Identity en el sistema?",
        answer: "Gestiona el registro de usuarios, el inicio de sesión, el hashing de contraseñas y la administración de roles de seguridad.",
        example: "🔐 Identity incluye:\n- UserManager: Crear, modificar usuarios\n- SignInManager: Login/Logout\n- RoleManager: Gestión de roles (Admin, Técnico)\n- PasswordHasher: Encriptar contraseñas"
    },
    {
        id: 29,
        category: "backend",
        question: "¿Cómo se restringe el acceso a un endpoint para que solo lo usen administradores en .NET?",
        answer: "Se utiliza el atributo [Authorize(Roles = \"Admin\")] sobre la acción del controlador.",
        example: "🛡️ Endpoint protegido:\n[Authorize(Roles = \"Admin\")]\n[HttpDelete(\"{id}\")]\npublic async Task<IActionResult> DeleteSensor(int id)\n{\n    // Solo admins pueden ejecutar esto\n}"
    },
    {
        id: 30,
        category: "backend",
        question: "Concepto: SignalR",
        answer: "Definición: Librería de ASP.NET que permite añadir funcionalidades web en tiempo real enviando actualizaciones del servidor al cliente instantáneamente.",
        example: "⚡ Dashboard en tiempo real:\nSensor envía dato → Backend recibe → SignalR.Clients.All.SendAsync(\"NuevaLectura\", dato)\n→ Dashboard se actualiza SIN refrescar la página"
    },
    {
        id: 31,
        category: "backend",
        question: "¿Por qué es más eficiente SignalR que el 'polling' tradicional para un dashboard?",
        answer: "Evita que el cliente pregunte repetidamente si hay datos nuevos, permitiendo que el servidor empuje la información solo cuando ésta llega.",
        example: "📊 Comparación:\nPolling: Cliente pregunta cada 5s (aunque no haya datos)\nSignalR: Servidor envía SOLO cuando hay datos nuevos\n→ Menos tráfico, menor latencia"
    },
    {
        id: 32,
        category: "backend",
        question: "¿Qué técnica de comunicación utiliza SignalR preferentemente antes de recurrir a alternativas?",
        answer: "Utiliza WebSockets como transporte principal para la comunicación bidireccional.",
        example: "🔄 Fallback automático:\n1. Intenta WebSockets (mejor opción)\n2. Si falla: Server-Sent Events\n3. Si falla: Long Polling\nSignalR elige automáticamente"
    },
    {
        id: 33,
        category: "backend",
        question: "¿Cómo se implementa la validación automática de modelos en ASP.NET Core?",
        answer: "Mediante el uso de Data Annotations (como [Required] o [Range]) en las propiedades de los DTOs de entrada.",
        example: "✅ DTO con validación:\npublic class CreateSensorDto\n{\n    [Required]\n    [MaxLength(100)]\n    public string Name { get; set; }\n    \n    [Range(0, 100)]\n    public double Humidity { get; set; }\n}"
    },
    {
        id: 34,
        category: "backend",
        question: "¿Qué código de estado HTTP devuelve automáticamente ASP.NET Core si falla la validación por Data Annotations?",
        answer: "Devuelve un código 400 Bad Request junto con el detalle de los campos que fallaron.",
        example: "🚫 Respuesta automática:\n{\n  \"errors\": {\n    \"Name\": [\"The Name field is required.\"],\n    \"Humidity\": [\"The field Humidity must be between 0 and 100.\"]\n  }\n}"
    },
    {
        id: 35,
        category: "backend",
        question: "¿Cuál es la diferencia entre validación de DTO y validación de negocio?",
        answer: "El DTO valida el formato (ej. campos obligatorios), mientras que la de negocio valida reglas lógicas (ej. si un sensor ya existe).",
        example: "📋 Dos niveles:\nDTO: [Required] → ¿Campo lleno?\nService: if (await _repo.ExistsAsync(name)) throw new Exception(\"Ya existe\");\n→ ¿Regla de negocio cumplida?"
    },
    {
        id: 36,
        category: "backend",
        question: "¿Qué código HTTP se debe devolver si un recurso solicitado no existe en el sistema?",
        answer: "El código 404 Not Found.",
        example: "🔍 Endpoint:\n[HttpGet(\"{id}\")]\npublic async Task<IActionResult> Get(int id)\n{\n    var sensor = await _service.GetAsync(id);\n    if (sensor == null) return NotFound(); // 404\n    return Ok(sensor); // 200\n}"
    },
    {
        id: 37,
        category: "backend",
        question: "¿Cómo se gestionaban las nuevas funcionalidades y correcciones de errores en el flujo de Git?",
        answer: "Mediante el uso de ramas (branches) por cada feature y Pull Requests para revisión antes de integrar a la rama principal.",
        example: "🌿 Git Flow:\n1. git checkout -b feature/sensor-alerts\n2. Desarrollas y commiteas\n3. Push y creas Pull Request\n4. Senior revisa y aprueba\n5. Merge a 'develop' o 'main'"
    },
    {
        id: 38,
        category: "backend",
        question: "¿Qué papel cumplía Postman en el ciclo de desarrollo del backend?",
        answer: "Se utilizaba para probar y documentar los endpoints manualmente antes de entregarlos al equipo de QA.",
        example: "📮 Workflow:\n1. Desarrollas endpoint\n2. Pruebas en Postman (casos happy path + edge cases)\n3. Documentas request/response en colección\n4. Compartes con QA\n→ QA recibe endpoint pre-validado"
    },
    {
        id: 39,
        category: "backend",
        question: "¿Cuál es la mejor forma de responder a un entrevistador si te pregunta sobre algo que no implementaste directamente?",
        answer: "Ser honesto indicando que no lo hiciste tú, pero explicar el principio teórico que entiendes sobre cómo funciona.",
        example: "💬 Respuesta ideal:\n\"Ese componente específico no lo implementé yo, pero el principio que entiendo es [explicación]. Los seniors lo diseñaron así por [razón]. ¿Es correcto mi entendimiento?\""
    },
    {
        id: 40,
        category: "architecture",
        question: "¿Cuáles son las cuatro capas en las que se estructuró el sistema de gestión de repuestos?",
        answer: "Domain, Application, Infrastructure y API.",
        example: "🏗️ Clean Architecture:\nDomain: Entidades, interfaces (núcleo)\nApplication: Casos de uso, lógica negocio\nInfrastructure: EF Core, repos, servicios externos\nAPI: Controllers, DTOs, presentación"
    },
    {
        id: 41,
        category: "frontend",
        question: "¿Qué librería de RxJS se usó para manejar el estado del usuario de forma reactiva en CayudiApp?",
        answer: "BehaviorSubject.",
        example: "🔄 Auth Service:\nprivate userSubject = new BehaviorSubject<User | null>(null);\npublic user$ = this.userSubject.asObservable();\n\n// Componentes se suscriben:\nthis.authService.user$.subscribe(user => ...)"
    },
    {
        id: 42,
        category: "ml",
        question: "¿Qué métrica de similitud se utilizó en el motor de recomendación de libros para comparar patrones de calificación?",
        answer: "La métrica de similitud coseno.",
        example: "📐 Similitud Coseno:\nMide el ángulo entre vectores de ratings\nValores: -1 (opuestos) a 1 (idénticos)\nIdeal para recomendaciones: ignora la magnitud, solo el patrón"
    },
    {
        id: 43,
        category: "ml",
        question: "¿Por qué se utilizó una matriz dispersa (csr_matrix) en el preprocesamiento de datos de libros?",
        answer: "Para optimizar la eficiencia en memoria y computación al manejar grandes conjuntos de datos con muchos valores en cero.",
        example: "💾 Optimización:\nMatriz 673×888 = 597,624 celdas\nDatos reales: 49,781 ratings (~8% lleno)\nMatriz normal: 597KB\ncsr_matrix: Solo almacena valores no-cero → ~50KB"
    },
    {
        id: 44,
        category: "backend",
        question: "¿Qué es una transacción de base de datos en el contexto de SaveChanges()?",
        answer: "Es un proceso que asegura que todas las operaciones de persistencia se realicen con éxito o que ninguna se aplique si ocurre un error.",
        example: "⚛️ Atomicidad:\ncontext.Orders.Add(order);\ncontext.Inventory.Update(stock);\nawait context.SaveChangesAsync();\n→ Si falla inventory, order también se revierte (todo o nada)"
    },
    {
        id: 45,
        category: "backend",
        question: "¿Qué es un 'Code Review' y para qué sirve en un equipo junior?",
        answer: "Es la revisión del código por parte de programadores senior para asegurar la calidad y transmitir buenas prácticas de arquitectura.",
        example: "👀 Mi experiencia:\nPR #1: 15 comentarios de mejora\nPR #10: 3 comentarios\nPR #30: Aprobado sin cambios\n→ Aprendizaje acelerado por feedback"
    },
    {
        id: 46,
        category: "backend",
        question: "Diferencia entre 401 Unauthorized y 403 Forbidden.",
        answer: "401 indica que el usuario no está autenticado, mientras que 403 indica que está autenticado pero no tiene permisos para el recurso.",
        example: "🔐 Casos:\n401: No envió token JWT → \"Por favor inicia sesión\"\n403: Usuario normal intenta acceder a /admin → \"No tienes permisos\""
    },
    {
        id: 47,
        category: "backend",
        question: "¿Qué es un 'Seeding' de base de datos?",
        answer: "Es el proceso de poblar la base de datos con datos iniciales necesarios para que la aplicación funcione en entornos de desarrollo o pruebas.",
        example: "🌱 Seeding:\nmodelBuilder.Entity<Role>().HasData(\n    new Role { Id = 1, Name = \"Admin\" },\n    new Role { Id = 2, Name = \"User\" }\n);\n→ BD siempre tiene roles al iniciar"
    },
    {
        id: 48,
        category: "backend",
        question: "¿Qué ventaja ofrece LINQ frente a escribir SQL tradicional para un desarrollador de C#?",
        answer: "Permite detectar errores de sintaxis y tipos en tiempo de compilación en lugar de esperar a la ejecución de la consulta.",
        example: "✅ LINQ:\nvar result = sensors.Where(s => s.Activo);\n// Si 'Activo' no existe → Error en compilación\n\n❌ SQL:\nSELECT * FROM Sensors WHERE Activo = 1\n// Error en runtime"
    },
    {
        id: 49,
        category: "backend",
        question: "Concepto: Token JWT",
        answer: "Definición: Es un estándar para transmitir información de forma segura entre partes como un objeto JSON, usado comúnmente para autenticación.",
        example: "🎫 JWT:\nHeader: {\"alg\": \"HS256\", \"typ\": \"JWT\"}\nPayload: {\"userId\": 5, \"role\": \"Admin\", \"exp\": 1234567890}\nSignature: Hash criptográfico\n→ Usuario envía JWT en cada request"
    },
    {
        id: 50,
        category: "backend",
        question: "¿Qué significa que un servicio sea registrado como 'Scoped' en .NET?",
        answer: "Significa que se crea una nueva instancia del servicio por cada solicitud HTTP recibida.",
        example: "🔄 Lifetimes:\nScoped: Nueva instancia por request HTTP (típico para servicios de negocio)\nTransient: Nueva instancia cada vez que se inyecta\nSingleton: Una sola instancia para toda la app"
    },
    {
        id: 51,
        category: "backend",
        question: "¿Cuál es el objetivo de utilizar la lógica asíncrona (async/await) en el acceso a datos?",
        answer: "Evitar el bloqueo del hilo principal de ejecución mientras se espera la respuesta de la base de datos, mejorando la escalabilidad.",
        example: "⚡ Async ventaja:\nSin async: Thread bloqueado esperando BD\nCon async: Thread liberado para otras requests\n→ Más requests concurrentes con menos threads"
    },
    {
        id: 52,
        category: "backend",
        question: "¿Cómo se asegura la comunicación entre un equipo IoT en México y un equipo Backend en Bolivia?",
        answer: "Mediante comunicación asíncrona en Slack, videollamadas para bloqueos y documentación rigurosa de APIs en Postman.",
        example: "🌎 Trabajo remoto:\n- Daily async en Slack\n- Postman Collections compartidas\n- Videollamadas para discusiones complejas\n- Git como source of truth\n→ Sin overlap de zonas horarias"
    },
    {
        id: 53,
        category: "frontend",
        question: "¿Qué es un 'Mock Service' en el desarrollo frontend?",
        answer: "Es un servicio que simula datos reales para permitir el desarrollo de la interfaz de usuario antes de que el backend esté disponible.",
        example: "🎭 Mock en CayudiApp:\ngetCourses(): Observable<Course[]> {\n    return of(MOCK_COURSES).pipe(delay(500));\n}\n→ Frontend avanza sin esperar backend"
    },
    {
        id: 54,
        category: "backend",
        question: "¿Cuál es la función del archivo DbContext en Entity Framework?",
        answer: "Actúa como el puente principal entre el código de la aplicación y la base de datos, gestionando las sesiones y entidades.",
        example: "🌉 DbContext:\npublic class AppDbContext : DbContext\n{\n    public DbSet<Sensor> Sensors { get; set; }\n    public DbSet<Reading> Readings { get; set; }\n    // Configura conexión, relaciones, constraints...\n}"
    },
    {
        id: 55,
        category: "ml",
        question: "¿Por qué se eliminaron usuarios con menos de 200 ratings en el proyecto de Machine Learning?",
        answer: "Para asegurar la significancia estadística y reducir el ruido en el modelo de recomendación.",
        example: "📊 Limpieza de datos:\nUsuario con 5 ratings → Patrón no confiable\nUsuario con 200+ ratings → Patrón estadísticamente válido\n1.1M ratings → 49K ratings (alta calidad)"
    },
    {
        id: 56,
        category: "backend",
        question: "¿Qué es .NET MAUI con Blazor Hybrid?",
        answer: "Es una tecnología que permite usar componentes web de Blazor para crear aplicaciones nativas de escritorio y móviles con un solo código.",
        example: "📱 Multiplataforma:\nCódigo: Componentes Blazor (.razor)\nOutput: Windows, macOS, iOS, Android\n→ Una base de código, múltiples plataformas nativas"
    },
    {
        id: 57,
        category: "backend",
        question: "¿Para qué sirve el comando 'Add-Migration' en EF Core?",
        answer: "Genera un archivo de código que describe los cambios necesarios en la base de datos para reflejar las modificaciones en las clases de C#.",
        example: "🔄 Workflow:\n1. Modificas entidad en C#: Sensor.Location (nuevo campo)\n2. Add-Migration AddLocationToSensor\n3. EF genera clase con Up() y Down()\n4. Update-Database → Aplica cambios"
    },
    {
        id: 58,
        category: "backend",
        question: "¿Qué es un 'NullReferenceException' y cómo ayuda la DI a evitarlo?",
        answer: "Es un error que ocurre al intentar acceder a un objeto nulo; la DI lo previene asegurando que todas las dependencias requeridas se inyecten al crear la clase.",
        example: "💥 Sin DI:\nclass Service {\n    private IRepo _repo; // null\n    void Method() { _repo.Save(); } // ❌ NullRef\n}\n\n✅ Con DI: Constructor garantiza _repo != null"
    },
    {
        id: 59,
        category: "frontend",
        question: "¿Qué significa 'lazy loading' en el contexto de Angular?",
        answer: "Es una técnica que carga los módulos de la aplicación solo cuando el usuario navega hacia ellos, optimizando el tiempo de carga inicial.",
        example: "🚀 Lazy Loading:\nInicial: Solo carga módulo de Login (50KB)\nNavega a /dashboard → Carga módulo Dashboard (200KB)\n→ Primera carga: 50KB en vez de 250KB"
    },
    {
        id: 60,
        category: "backend",
        question: "¿Cuál es la diferencia entre un 'Index Seek' y un 'Index Scan'?",
        answer: "Un Seek va directamente a la ubicación del dato usando el índice, mientras que un Scan recorre todo el índice, siendo el Seek mucho más rápido.",
        example: "🔍 En plan de ejecución:\nIndex Seek: Va a filas específicas (📍)\nIndex Scan: Lee todo el índice (📖)\nTable Scan: Lee toda la tabla (📚)\n→ Seek es el objetivo"
    }
];
