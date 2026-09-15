import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import * as XLSX from 'xlsx'
import './App.css'

function App() {
  const [modoRegistro, setModoRegistro] = useState(false)

  // USUARIO / SESIÓN
  const [usuario, setUsuario] = useState(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)
  const [perfil, setPerfil] = useState(null)
  const [seccion, setSeccion] = useState('dashboard')

  // DATOS DEL REGISTRO / LOGIN
  const [nombre, setNombre] = useState('')
  const [nombreNegocio, setNombreNegocio] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')

  // MENSAJES
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  // PRODUCTOS
  const [productos, setProductos] = useState([])
  const [mostrarFormularioProducto, setMostrarFormularioProducto] = useState(false)
  const [cargandoProductos, setCargandoProductos] = useState(false)
  const [guardandoProducto, setGuardandoProducto] = useState(false)
  const [mensajeProducto, setMensajeProducto] = useState('')
  const [productoForm, setProductoForm] = useState({
    nombre: '', sku: '', categoria: '', precio_venta: '', costo: '', stock: '', stock_minimo: ''
  })

  // =========================
  // COMPROBAR SESIÓN
  // =========================

  useEffect(() => {
  const comprobarSesion = async () => {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error comprobando sesión:', error)
      setCargandoSesion(false)
      return
    }

    const usuarioActual = data.session?.user ?? null

    setUsuario(usuarioActual)

    if (usuarioActual) {
      await obtenerPerfil(usuarioActual.id)
    }

    setCargandoSesion(false)
  }

  comprobarSesion()

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    const usuarioActual = session?.user ?? null

    setUsuario(usuarioActual)

    if (usuarioActual) {
      obtenerPerfil(usuarioActual.id)
    } else {
      setPerfil(null)
    }

    setCargandoSesion(false)
  })

  return () => {
    subscription.unsubscribe()
  }
}, [])

  // =========================
// OBTENER PERFIL
// =========================

const obtenerPerfil = async (usuarioId) => {
  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombre, negocio_id, rol')
    .eq('id', usuarioId)
    .single()

  if (error) {
    console.error('Error obteniendo perfil:', error)
    return
  }

  setPerfil(data)

  console.log('Perfil NOREVIK:', data)
}

const cargarProductos = async (negocioId) => {
  if (!negocioId) return
  setCargandoProductos(true)
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('negocio_id', negocioId)
    .eq('activo', true)
    .order('creado_en', { ascending: false })

  if (error) {
    console.error('Error cargando productos:', error)
    setMensajeProducto('No se pudieron cargar los productos.')
  } else {
    setProductos(data ?? [])
  }
  setCargandoProductos(false)
}

useEffect(() => {
  if (perfil?.negocio_id) cargarProductos(perfil.negocio_id)
}, [perfil?.negocio_id])

const generarSkuAutomatico = (nombreProducto) => {
  const limpio = nombreProducto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .toUpperCase()

  if (!limpio) return ''

  const palabras = limpio.split(/\s+/).filter(Boolean)
  let prefijo = ''

  if (palabras.length === 1) {
    prefijo = palabras[0].slice(0, 3)
  } else {
    prefijo = palabras
      .slice(0, 3)
      .map((palabra) => palabra.charAt(0))
      .join('')

    if (prefijo.length < 3) {
      prefijo = limpio.replace(/\s+/g, '').slice(0, 3)
    }
  }

  const numerosUsados = productos
    .map((producto) => producto.sku || '')
    .filter((sku) => sku.startsWith(`${prefijo}-`))
    .map((sku) => Number(sku.split('-').pop()))
    .filter((numero) => Number.isInteger(numero))

  const siguienteNumero =
    numerosUsados.length > 0 ? Math.max(...numerosUsados) + 1 : 1

  return `${prefijo}-${String(siguienteNumero).padStart(3, '0')}`
}

const cambiarNombreProducto = (valor) => {
  setProductoForm((actual) => {
    const skuAnteriorAutomatico = generarSkuAutomatico(actual.nombre)
    const skuFueEditadoManualmente =
      actual.sku !== '' && actual.sku !== skuAnteriorAutomatico

    return {
      ...actual,
      nombre: valor,
      sku: skuFueEditadoManualmente
        ? actual.sku
        : generarSkuAutomatico(valor),
    }
  })
}

const guardarProducto = async (e) => {
  e.preventDefault()
  setMensajeProducto('')

  if (!perfil?.negocio_id) {
    setMensajeProducto('No se pudo identificar el negocio.')
    return
  }
  if (!productoForm.nombre.trim() || productoForm.precio_venta === '') {
    setMensajeProducto('Completa el nombre y el precio de venta.')
    return
  }

  const nuevoProducto = {
    negocio_id: perfil.negocio_id,
    nombre: productoForm.nombre.trim(),
    sku: productoForm.sku.trim() || null,
    categoria: productoForm.categoria.trim() || null,
    precio_venta: Number(productoForm.precio_venta),
    costo: productoForm.costo === '' ? 0 : Number(productoForm.costo),
    stock: productoForm.stock === '' ? 0 : Number(productoForm.stock),
    stock_minimo: productoForm.stock_minimo === '' ? 0 : Number(productoForm.stock_minimo),
    activo: true,
  }

  if ([nuevoProducto.precio_venta, nuevoProducto.costo, nuevoProducto.stock, nuevoProducto.stock_minimo].some(Number.isNaN)) {
    setMensajeProducto('Revisa los valores numéricos del producto.')
    return
  }

  setGuardandoProducto(true)
  const { data, error } = await supabase
    .from('productos')
    .insert(nuevoProducto)
    .select()
    .single()

  if (error) {
    console.error('Error guardando producto:', error)
    setMensajeProducto(error.message)
  } else {
    setProductos((actuales) => [data, ...actuales])
    setProductoForm({ nombre: '', sku: '', categoria: '', precio_venta: '', costo: '', stock: '', stock_minimo: '' })
    setMostrarFormularioProducto(false)
    setMensajeProducto('Producto guardado correctamente.')
  }
  setGuardandoProducto(false)
}

const exportarProductosExcel = () => {
  setMensajeProducto('')

  if (productos.length === 0) {
    setMensajeProducto('No hay productos para exportar.')
    return
  }

  const datosExcel = productos.map((producto) => {
    const stock = Number(producto.stock || 0)
    const stockMinimo = Number(producto.stock_minimo || 0)

    return {
      Producto: producto.nombre,
      SKU: producto.sku || '',
      Categoría: producto.categoria || '',
      'Precio de venta': Number(producto.precio_venta || 0),
      Costo: Number(producto.costo || 0),
      Stock: stock,
      'Stock mínimo': stockMinimo,
      Estado: stock <= stockMinimo ? 'Stock bajo' : 'Disponible',
    }
  })

  const hoja = XLSX.utils.json_to_sheet(datosExcel)

  hoja['!cols'] = [
    { wch: 30 },
    { wch: 18 },
    { wch: 22 },
    { wch: 18 },
    { wch: 15 },
    { wch: 10 },
    { wch: 14 },
    { wch: 16 },
  ]

  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'Productos')

  const hoy = new Date()
  const fecha = [
    String(hoy.getDate()).padStart(2, '0'),
    String(hoy.getMonth() + 1).padStart(2, '0'),
    hoy.getFullYear(),
  ].join('-')

  XLSX.writeFile(libro, `NOREVIK_Productos_${fecha}.xlsx`)
  setMensajeProducto('Excel exportado correctamente.')
}

  // =========================
  // CREAR CUENTA
  // =========================

  const crearCuenta = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (
      !nombre.trim() ||
      !nombreNegocio.trim() ||
      !correo.trim() ||
      !password ||
      !confirmarPassword
    ) {
      setMensaje('Completa todos los campos.')
      return
    }

    if (password !== confirmarPassword) {
      setMensaje('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    try {
      setCargando(true)

      const { data, error } = await supabase.auth.signUp({
        email: correo.trim(),
        password,
        options: {
          data: {
            nombre: nombre.trim(),
            nombre_negocio: nombreNegocio.trim(),
          },
        },
      })

      if (error) {
        setMensaje(error.message)
        return
      }

      if (data.user) {
        setMensaje(
          'Cuenta creada. Revisa tu correo para confirmar tu cuenta.'
        )

        setNombre('')
        setNombreNegocio('')
        setCorreo('')
        setPassword('')
        setConfirmarPassword('')
      }
    } catch (error) {
      console.error(error)
      setMensaje('Ocurrió un error al crear la cuenta.')
    } finally {
      setCargando(false)
    }
  }

  // =========================
  // INICIAR SESIÓN
  // =========================

  const iniciarSesion = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (!correo.trim() || !password) {
      setMensaje('Ingresa tu correo y contraseña.')
      return
    }

    try {
      setCargando(true)

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: correo.trim(),
          password,
        })

      if (error) {
        setMensaje(error.message)
        return
      }

      if (data.user) {
        setUsuario(data.user)
        setCorreo('')
        setPassword('')
        setMensaje('')
      }
    } catch (error) {
      console.error(error)
      setMensaje('Ocurrió un error al iniciar sesión.')
    } finally {
      setCargando(false)
    }
  }

  // =========================
  // CERRAR SESIÓN
  // =========================

  const cerrarSesion = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error(error)
      return
    }

    setUsuario(null)
    setCorreo('')
    setPassword('')
    setMensaje('')
  }

  // =========================
  // CARGANDO SESIÓN
  // =========================

  if (cargandoSesion) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <p>Cargando NOREVIK...</p>
      </div>
    )
  }

// =========================
// DASHBOARD
// =========================

if (usuario) {
  const nombreUsuario =
    perfil?.nombre ||
    usuario.user_metadata?.nombre ||
    'Usuario'

  const negocio =
    usuario.user_metadata?.nombre_negocio ||
    'Mi negocio'

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-logo">N</div>

          <div>
            <h2>NOREVIK</h2>
            <span>Gestión de negocio</span>
          </div>
        </div>

        <nav className="sidebar-menu">

          <button
            className={`menu-item ${
              seccion === 'dashboard' ? 'active' : ''
            }`}
            onClick={() => setSeccion('dashboard')}
          >
            <span>⌂</span>
            Panel de control
          </button>

          <button className="menu-item">
            <span>▣</span>
            Ventas
          </button>

          <button
            className={`menu-item ${
              seccion === 'productos' ? 'active' : ''
            }`}
            onClick={() => setSeccion('productos')}
          >
            <span>□</span>
            Productos
          </button>

          <button className="menu-item">
            <span>▤</span>
            Inventario
          </button>

          <button className="menu-item">
            <span>♙</span>
            Clientes
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-user">
            <div className="user-avatar">
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{nombreUsuario}</strong>
              <span>{usuario.email}</span>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>

        </div>

      </aside>

      {/* CONTENIDO */}
      <main className="dashboard-main">

        {seccion === 'dashboard' && (
          <>
            {/* HEADER */}
            <header className="dashboard-header">

              <div>
                <span className="dashboard-label">
                  PANEL DE CONTROL
                </span>

                <h1>Buenos días, {nombreUsuario}</h1>

                <p>
                  Aquí tienes un resumen de lo que está
                  pasando en {negocio}.
                </p>
              </div>

              <div className="business-name">
                <span>Negocio</span>
                <strong>{negocio}</strong>
              </div>

            </header>

            {/* MÉTRICAS */}
            <section className="dashboard-stats">

              <article className="stat-card">
                <div className="stat-top">
                  <span>Ventas de hoy</span>
                  <div className="stat-icon">$</div>
                </div>

                <strong className="stat-value">0</strong>

                <span className="stat-detail">
                  Sin ventas registradas
                </span>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Ingresos de hoy</span>
                  <div className="stat-icon">$</div>
                </div>

                <strong className="stat-value">$0</strong>

                <span className="stat-detail">
                  Total vendido hoy
                </span>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Productos</span>
                  <div className="stat-icon">□</div>
                </div>

                <strong className="stat-value">{productos.length}</strong>

                <span className="stat-detail">
                  Productos registrados
                </span>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Stock bajo</span>
                  <div className="stat-icon">!</div>
                </div>

                <strong className="stat-value">{productos.filter((p) => Number(p.stock) <= Number(p.stock_minimo)).length}</strong>

                <span className="stat-detail">
                  {productos.some((p) => Number(p.stock) <= Number(p.stock_minimo)) ? 'Revisa el inventario' : 'Todo bajo control'}
                </span>
              </article>

            </section>

            {/* ACCIONES */}
            <section className="quick-section">

              <div className="section-heading">
                <div>
                  <h2>Acciones rápidas</h2>

                  <p>
                    Accede rápidamente a las tareas más frecuentes.
                  </p>
                </div>
              </div>

              <div className="quick-actions">

                <button className="quick-card">
                  <div className="quick-icon">+</div>

                  <div>
                    <strong>Nueva venta</strong>
                    <span>Registrar una nueva venta</span>
                  </div>
                </button>

                <button
                  className="quick-card"
                  onClick={() => setSeccion('productos')}
                >
                  <div className="quick-icon">+</div>

                  <div>
                    <strong>Agregar producto</strong>
                    <span>Crear un producto nuevo</span>
                  </div>
                </button>

                <button className="quick-card">
                  <div className="quick-icon">▤</div>

                  <div>
                    <strong>Ver inventario</strong>
                    <span>Consultar productos y stock</span>
                  </div>
                </button>

              </div>

            </section>

            {/* PARTE INFERIOR */}
            <section className="dashboard-bottom">

              <article className="dashboard-panel">

                <div className="panel-heading">
                  <div>
                    <h2>Ventas recientes</h2>
                    <p>Últimas operaciones registradas</p>
                  </div>

                  <button>Ver todas</button>
                </div>

                <div className="empty-state">
                  <div className="empty-icon">📦</div>

                  <strong>Aún no hay ventas</strong>

                  <span>
                    Las ventas que registres aparecerán aquí.
                  </span>
                </div>

              </article>

              <article className="dashboard-panel">

                <div className="panel-heading">
                  <div>
                    <h2>Productos destacados</h2>
                    <p>Productos con mayor movimiento</p>
                  </div>
                </div>

                <div className="empty-state">
                  <div className="empty-icon">□</div>

                  <strong>Aún no hay productos</strong>

                  <span>
                    Agrega productos para comenzar a gestionar
                    tu inventario.
                  </span>
                </div>

              </article>

            </section>
          </>
        )}

        {/* ========================= */}
        {/* PRODUCTOS */}
        {/* ========================= */}

        {seccion === 'productos' && (
          <>
            <header className="dashboard-header">

              <div>
                <span className="dashboard-label">
                  PRODUCTOS
                </span>

                <h1>Productos</h1>

                <p>
                  Gestiona el catálogo de productos de {negocio}.
                </p>
              </div>

              <div className="business-name">
                <span>Negocio</span>
                <strong>{negocio}</strong>
              </div>

            </header>

            <section className="dashboard-panel">

              <div className="panel-heading">

                <div>
                  <h2>Catálogo de productos</h2>
                  <p>
                    Administra los productos disponibles en tu negocio.
                  </p>
                </div>

                <div className="product-heading-actions">
                  <button
                    type="button"
                    className="export-excel-button"
                    onClick={exportarProductosExcel}
                    disabled={productos.length === 0}
                  >
                    Exportar Excel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormularioProducto(true)
                      setMensajeProducto('')
                    }}
                  >
                    + Agregar producto
                  </button>
                </div>

              </div>

              {mensajeProducto && <p className="auth-message">{mensajeProducto}</p>}

              {mostrarFormularioProducto && (
                <form onSubmit={guardarProducto} className="product-form">
                  <div className="product-form-grid">
                    <div className="form-group"><label>Nombre del producto *</label><input type="text" value={productoForm.nombre} onChange={(e) => cambiarNombreProducto(e.target.value)} placeholder="Ej: Cuaderno universitario" /></div>
                    <div className="form-group"><label>SKU / Código</label><input type="text" value={productoForm.sku} onChange={(e) => setProductoForm({ ...productoForm, sku: e.target.value })} placeholder="Se genera automáticamente" /></div>
                    <div className="form-group"><label>Categoría</label><input type="text" value={productoForm.categoria} onChange={(e) => setProductoForm({ ...productoForm, categoria: e.target.value })} placeholder="Ej: Librería" /></div>
                    <div className="form-group"><label>Precio de venta *</label><input type="number" min="0" step="1" value={productoForm.precio_venta} onChange={(e) => setProductoForm({ ...productoForm, precio_venta: e.target.value })} placeholder="0" /></div>
                    <div className="form-group"><label>Costo</label><input type="number" min="0" step="1" value={productoForm.costo} onChange={(e) => setProductoForm({ ...productoForm, costo: e.target.value })} placeholder="0" /></div>
                    <div className="form-group"><label>Stock inicial</label><input type="number" min="0" step="1" value={productoForm.stock} onChange={(e) => setProductoForm({ ...productoForm, stock: e.target.value })} placeholder="0" /></div>
                    <div className="form-group"><label>Stock mínimo</label><input type="number" min="0" step="1" value={productoForm.stock_minimo} onChange={(e) => setProductoForm({ ...productoForm, stock_minimo: e.target.value })} placeholder="0" /></div>
                  </div>
                  <div className="product-form-actions">
                    <button type="button" onClick={() => { setMostrarFormularioProducto(false); setMensajeProducto('') }}>Cancelar</button>
                    <button type="submit" className="login-button" disabled={guardandoProducto}>{guardandoProducto ? 'Guardando...' : 'Guardar producto'}</button>
                  </div>
                </form>
              )}

              {cargandoProductos ? (
                <div className="empty-state"><strong>Cargando productos...</strong></div>
              ) : productos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">□</div>
                  <strong>Aún no hay productos</strong>
                  <span>Agrega tu primer producto para comenzar a gestionar el inventario.</span>
                </div>
              ) : (
                <div className="products-table-wrap">
                  <table className="products-table">
                    <thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th></tr></thead>
                    <tbody>
                      {productos.map((producto) => {
                        const stockBajo = Number(producto.stock) <= Number(producto.stock_minimo)
                        return (
                          <tr key={producto.id}>
                            <td><strong>{producto.nombre}</strong></td>
                            <td>{producto.sku || '—'}</td>
                            <td>{producto.categoria || '—'}</td>
                            <td>${Number(producto.precio_venta || 0).toLocaleString('es-CL')}</td>
                            <td>{producto.stock}</td>
                            <td><span className={stockBajo ? 'product-status low' : 'product-status ok'}>{stockBajo ? 'Stock bajo' : 'Disponible'}</span></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </section>
          </>
        )}

      </main>

    </div>
  )
}
  // =========================
  // LOGIN / REGISTRO
  // =========================

  return (
    <div className="login-page">

      {/* PANEL IZQUIERDO */}

      <div className="login-panel">

        <div className="brand">
          <div className="brand-icon">N</div>

          <div>
            <h1>NOREVIK</h1>
            <p>Tu negocio en movimiento.</p>
          </div>
        </div>

        {!modoRegistro ? (

          /* LOGIN */

          <div className="login-content">

            <h2>Inicia sesión en tu negocio</h2>

            <p className="login-description">
              Controla tus ventas, productos, stock y clientes
              desde un solo lugar.
            </p>

            <form onSubmit={iniciarSesion}>

              <div className="form-group">
                <label>Correo electrónico</label>

                <input
                  type="email"
                  placeholder="nombre@empresa.cl"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>

                <input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {mensaje && (
                <p className="auth-message">
                  {mensaje}
                </p>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={cargando}
              >
                {cargando
                  ? 'Iniciando sesión...'
                  : 'Iniciar sesión'}
              </button>

            </form>

            <p className="register-text">
              ¿Aún no tienes una cuenta?{' '}

              <button
                type="button"
                onClick={() => {
                  setModoRegistro(true)
                  setMensaje('')
                }}
              >
                Crear negocio
              </button>
            </p>

          </div>

        ) : (

          /* REGISTRO */

          <div className="login-content">

            <h2>Crea tu cuenta</h2>

            <p className="login-description"></p>

            <form onSubmit={crearCuenta}>

              <div className="form-group">
                <label>Tu nombre</label>

                <input
                  type="text"
                  placeholder="Ej: Nombre Apellido"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Nombre del negocio</label>

                <input
                  type="text"
                  placeholder="Ej: Minimarket Central"
                  value={nombreNegocio}
                  onChange={(e) =>
                    setNombreNegocio(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Correo electrónico</label>

                <input
                  type="email"
                  placeholder="nombre@empresa.cl"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>

                <input
                  type="password"
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Confirmar contraseña</label>

                <input
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmarPassword}
                  onChange={(e) =>
                    setConfirmarPassword(e.target.value)
                  }
                />
              </div>

              {mensaje && (
                <p className="auth-message">
                  {mensaje}
                </p>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={cargando}
              >
                {cargando
                  ? 'Creando negocio...'
                  : 'Crear mi negocio'}
              </button>

            </form>

            <p className="register-text">
              ¿Ya tienes una cuenta?{' '}

              <button
                type="button"
                onClick={() => {
                  setModoRegistro(false)
                  setMensaje('')
                }}
              >
                Iniciar sesión
              </button>
            </p>

          </div>

        )}

        <div className="login-footer">
          <span>NOREVIK</span>
          <span>
            Gestión inteligente para pequeños negocios
          </span>
        </div>

      </div>

      {/* PANEL DERECHO */}

      <div className="login-visual">

        <img
          src="/norevik-city.png"
          alt=""
          className="login-city-image"
        />

        <div className="login-city-overlay"></div>

        <div className="visual-content">

          <span className="visual-badge">
            Todo bajo control
          </span>

          <h3>
            Una forma más simple de administrar tu negocio.
          </h3>

          <p>
            Ventas, inventario y clientes conectados
            en una sola plataforma.
          </p>

          <div className="preview-card">

            <div className="preview-header">
              <span>Resumen de hoy</span>
              <span>● En línea</span>
            </div>

            <div className="preview-stats">

              <div>
                <span>Ventas</span>
                <strong>24</strong>
              </div>

              <div>
                <span>Ingresos</span>
                <strong>$328.900</strong>
              </div>

            </div>

            <div className="preview-stock">

              <div>
                <span>Stock disponible</span>
                <strong>486 productos</strong>
              </div>

              <span className="stock-alert">
                4 con stock bajo
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default App