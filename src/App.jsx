import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import * as XLSX from 'xlsx'
import './App.css'

function App() {
  const [modoRegistro, setModoRegistro] = useState(false)

  // USUARIO / SESIÓN
  const [usuario, setUsuario] = useState(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)
  const [cerrandoSesion, setCerrandoSesion] = useState(false)
  
  const [confirmarCerrarSesion, setConfirmarCerrarSesion] = useState(false)
const [perfil, setPerfil] = useState(null)
  const [seccion, setSeccion] = useState('dashboard')
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)

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

  // INVENTARIO
  const [busquedaInventario, setBusquedaInventario] = useState('')
  const [movimientosInventario, setMovimientosInventario] = useState([])
  const [productoMovimiento, setProductoMovimiento] = useState(null)
  const [movimientoForm, setMovimientoForm] = useState({
    tipo: 'entrada',
    cantidad: '',
    motivo: '',
  })
  const [guardandoMovimiento, setGuardandoMovimiento] = useState(false)
  const [mensajeInventario, setMensajeInventario] = useState('')

  // VENTAS
  const [busquedaVenta, setBusquedaVenta] = useState('')
  const [carrito, setCarrito] = useState([])
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [guardandoVenta, setGuardandoVenta] = useState(false)
  const [mensajeVenta, setMensajeVenta] = useState('')
  const [ventas, setVentas] = useState([])
  const [ventaDetalle, setVentaDetalle] = useState(null)
  const [anulandoVenta, setAnulandoVenta] = useState(false)
  const [ventaPorAnular, setVentaPorAnular] = useState(null)
  const [clienteVentaId, setClienteVentaId] = useState('')

  // CAJA
  const [cajaActual, setCajaActual] = useState(null)
  const [montoInicialCaja, setMontoInicialCaja] = useState('')
  const [cargandoCaja, setCargandoCaja] = useState(false)
  const [abriendoCaja, setAbriendoCaja] = useState(false)
  const [mensajeCaja, setMensajeCaja] = useState('')
  const [resumenCaja, setResumenCaja] = useState(null)
  const [cargandoResumenCaja, setCargandoResumenCaja] = useState(false)
  const [mostrarMovimientoCaja, setMostrarMovimientoCaja] = useState(false)
  const [guardandoMovimientoCaja, setGuardandoMovimientoCaja] = useState(false)
  const [movimientosCaja, setMovimientosCaja] = useState([])
  const [cargandoMovimientosCaja, setCargandoMovimientosCaja] = useState(false)
  const [movimientoCajaForm, setMovimientoCajaForm] = useState({
    tipo: 'entrada',
    categoria: 'ingreso',
    monto: '',
    descripcion: '',
  })
  const [mostrarCierreCaja, setMostrarCierreCaja] = useState(false)
  const [cerrandoCaja, setCerrandoCaja] = useState(false)
  const [montoFinalCaja, setMontoFinalCaja] = useState('')

  // CLIENTES
  const [clientes, setClientes] = useState([])
  const [busquedaCliente, setBusquedaCliente] = useState('')
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false)
  const [guardandoCliente, setGuardandoCliente] = useState(false)
  const [mensajeCliente, setMensajeCliente] = useState('')
  const [clienteEditando, setClienteEditando] = useState(null)
  const [clientePorEliminar, setClientePorEliminar] = useState(null)
  const [eliminandoCliente, setEliminandoCliente] = useState(false)
  const [rutClienteEnFoco, setRutClienteEnFoco] = useState(false)
  const [clienteForm, setClienteForm] = useState({
    nombre: '',
    rut: '',
    telefono: '',
    correo: '',
  })

  // PROVEEDORES
  const [proveedores, setProveedores] = useState([])
  const [busquedaProveedor, setBusquedaProveedor] = useState('')
  const [mostrarFormularioProveedor, setMostrarFormularioProveedor] = useState(false)
  const [guardandoProveedor, setGuardandoProveedor] = useState(false)
  const [mensajeProveedor, setMensajeProveedor] = useState('')
  const [proveedorEditando, setProveedorEditando] = useState(null)
  const [proveedorPorEliminar, setProveedorPorEliminar] = useState(null)
  const [eliminandoProveedor, setEliminandoProveedor] = useState(false)
  const [rutProveedorEnFoco, setRutProveedorEnFoco] = useState(false)
  const [proveedorForm, setProveedorForm] = useState({
    nombre: '',
    rut: '',
    telefono: '',
    correo: '',
    contacto: '',
  })

  // COMPRAS
  const [compras, setCompras] = useState([])
  const [busquedaCompra, setBusquedaCompra] = useState('')
  const [proveedorCompraId, setProveedorCompraId] = useState('')
  const [metodoPagoCompra, setMetodoPagoCompra] = useState('transferencia')
  const [numeroDocumentoCompra, setNumeroDocumentoCompra] = useState('')
  const [observacionesCompra, setObservacionesCompra] = useState('')
  const [carritoCompra, setCarritoCompra] = useState([])
  const [guardandoCompra, setGuardandoCompra] = useState(false)
  const [mensajeCompra, setMensajeCompra] = useState('')
  const [compraDetalle, setCompraDetalle] = useState(null)
  const [compraPorAnular, setCompraPorAnular] = useState(null)
  const [anulandoCompra, setAnulandoCompra] = useState(false)

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

  useEffect(() => {
    setMenuMovilAbierto(false)
  }, [seccion])

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

const cargarMovimientosInventario = async (negocioId) => {
  if (!negocioId) return

  const { data, error } = await supabase
    .from('movimientos_inventario')
    .select(`
      id,
      tipo,
      cantidad,
      stock_anterior,
      stock_nuevo,
      motivo,
      creado_en,
      producto_id,
      productos (
        nombre,
        sku
      )
    `)
    .eq('negocio_id', negocioId)
    .order('creado_en', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error cargando movimientos:', error)
    setMensajeInventario('No se pudo cargar el historial de inventario.')
    return
  }

  setMovimientosInventario(data ?? [])
}
useEffect(() => {
  if (!mensajeCaja) return

  const timer = setTimeout(() => {
    setMensajeCaja('')
  }, 3000)

  return () => clearTimeout(timer)
}, [mensajeCaja])

useEffect(() => {
  if (perfil?.negocio_id) {
    cargarMovimientosInventario(perfil.negocio_id)
  }
}, [perfil?.negocio_id])

const abrirMovimientoStock = (producto) => {
  setProductoMovimiento(producto)
  setMovimientoForm({
    tipo: 'entrada',
    cantidad: '',
    motivo: '',
  })
  setMensajeInventario('')
}

const cerrarMovimientoStock = () => {
  setProductoMovimiento(null)
  setMovimientoForm({
    tipo: 'entrada',
    cantidad: '',
    motivo: '',
  })
}

const registrarMovimientoStock = async (e) => {
  e.preventDefault()
  setMensajeInventario('')

  if (!productoMovimiento) return

  const cantidad = Number(movimientoForm.cantidad)

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    setMensajeInventario('Ingresa una cantidad válida mayor a 0.')
    return
  }

  if (
    movimientoForm.tipo === 'salida' &&
    cantidad > Number(productoMovimiento.stock || 0)
  ) {
    setMensajeInventario('No puedes retirar más unidades de las disponibles.')
    return
  }

  setGuardandoMovimiento(true)

  const { error } = await supabase.rpc('registrar_movimiento_inventario', {
    p_producto_id: productoMovimiento.id,
    p_tipo: movimientoForm.tipo,
    p_cantidad: cantidad,
    p_motivo: movimientoForm.motivo.trim() || null,
  })

  if (error) {
    console.error('Error registrando movimiento:', error)
    setMensajeInventario(error.message)
    setGuardandoMovimiento(false)
    return
  }

  await Promise.all([
    cargarProductos(perfil.negocio_id),
    cargarMovimientosInventario(perfil.negocio_id),
  ])

  const textoTipo =
    movimientoForm.tipo === 'entrada'
      ? 'Entrada'
      : movimientoForm.tipo === 'salida'
        ? 'Salida'
        : 'Ajuste'

  setMensajeInventario(`${textoTipo} registrada correctamente.`)
  cerrarMovimientoStock()
  setGuardandoMovimiento(false)
}

const formatearFechaMovimiento = (fecha) => {
  if (!fecha) return '—'

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha))
}


const cargarVentas = async (negocioId) => {
  if (!negocioId) return

  const { data, error } = await supabase
    .from('ventas')
    .select(`
      id,
      total,
      metodo_pago,
      estado,
      creado_en,
      cliente_id,
      clientes (
        id,
        nombre,
        rut,
        telefono,
        correo
      ),
      detalle_ventas (
        id,
        cantidad,
        precio_unitario,
        subtotal,
        productos (
          nombre,
          sku
        )
      )
    `)
    .eq('negocio_id', negocioId)
    .order('creado_en', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error cargando ventas:', error)
    setMensajeVenta('No se pudo cargar el historial de ventas.')
    return
  }

  setVentas(data ?? [])
}

useEffect(() => {
  if (perfil?.negocio_id) {
    cargarVentas(perfil.negocio_id)
  }
}, [perfil?.negocio_id])

const agregarAlCarrito = (producto) => {
  setMensajeVenta('')

  if (Number(producto.stock || 0) <= 0) {
    setMensajeVenta(`${producto.nombre} no tiene stock disponible.`)
    return
  }

  setCarrito((actual) => {
    const existente = actual.find((item) => item.id === producto.id)

    if (existente) {
      if (existente.cantidad >= Number(producto.stock || 0)) {
        setMensajeVenta(`Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}.`)
        return actual
      }

      return actual.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    }

    return [...actual, { ...producto, cantidad: 1 }]
  })
}

const cambiarCantidadCarrito = (productoId, nuevaCantidad) => {
  const producto = productos.find((item) => item.id === productoId)
  if (!producto) return

  if (nuevaCantidad <= 0) {
    setCarrito((actual) => actual.filter((item) => item.id !== productoId))
    return
  }

  if (nuevaCantidad > Number(producto.stock || 0)) {
    setMensajeVenta(`Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}.`)
    return
  }

  setMensajeVenta('')
  setCarrito((actual) =>
    actual.map((item) =>
      item.id === productoId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    )
  )
}

const quitarDelCarrito = (productoId) => {
  setCarrito((actual) => actual.filter((item) => item.id !== productoId))
  setMensajeVenta('')
}

const registrarVenta = async () => {
  setMensajeVenta('')

  if (carrito.length === 0) {
    setMensajeVenta('Agrega al menos un producto a la venta.')
    return
  }

  const productosVenta = carrito.map((item) => ({
    producto_id: item.id,
    cantidad: item.cantidad,
  }))

  setGuardandoVenta(true)

  const { error } = await supabase.rpc('registrar_venta', {
    p_metodo_pago: metodoPago,
    p_productos: productosVenta,
    p_cliente_id: clienteVentaId || null,
  })

  if (error) {
    console.error('Error registrando venta:', error)
    setMensajeVenta(error.message)
    setGuardandoVenta(false)
    return
  }

  await Promise.all([
    cargarProductos(perfil.negocio_id),
    cargarMovimientosInventario(perfil.negocio_id),
    cargarVentas(perfil.negocio_id),
    cargarResumenCaja(),
  ])

  setCarrito([])
  setMetodoPago('efectivo')
  setClienteVentaId('')
  setBusquedaVenta('')
  setMensajeVenta('Venta registrada correctamente.')
  setGuardandoVenta(false)
}


const abrirDetalleVenta = (venta) => {
  setVentaDetalle(venta)
  setMensajeVenta('')
}

const cerrarDetalleVenta = () => {
  if (anulandoVenta) return
  setVentaDetalle(null)
}

const solicitarAnulacionVenta = (venta) => {
  if (!venta || venta.estado === 'anulada') return
  setVentaPorAnular(venta)
}

const cerrarConfirmacionAnulacion = () => {
  if (anulandoVenta) return
  setVentaPorAnular(null)
}

const anularVenta = async () => {
  const venta = ventaPorAnular

  if (!venta || venta.estado === 'anulada') return

  setAnulandoVenta(true)
  setMensajeVenta('')

  const { error } = await supabase.rpc('anular_venta', {
    p_venta_id: venta.id,
  })

  if (error) {
    console.error('Error anulando venta:', error)
    setMensajeVenta(error.message)
    setAnulandoVenta(false)
    return
  }

  await Promise.all([
    cargarProductos(perfil.negocio_id),
    cargarMovimientosInventario(perfil.negocio_id),
    cargarVentas(perfil.negocio_id),
    cargarResumenCaja(),
  ])

  setVentaDetalle(null)
  setVentaPorAnular(null)
  setMensajeVenta(
    'Venta anulada correctamente. El stock fue devuelto al inventario.'
  )
  setAnulandoVenta(false)
}

const formatearFechaVenta = (fecha) => {
  if (!fecha) return '—'

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha))
}


  // =========================
  // CAJA
  // =========================

  const cargarCajaActual = async (negocioId) => {
    if (!negocioId) return

    setCargandoCaja(true)

    const { data, error } = await supabase
      .from('cajas')
      .select('*')
      .eq('negocio_id', negocioId)
      .eq('estado', 'abierta')
      .order('abierta_en', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error cargando caja:', error)
      setMensajeCaja('No se pudo consultar el estado de la caja.')
      setCargandoCaja(false)
      return
    }

    setCajaActual(data ?? null)
    setCargandoCaja(false)
  }

  const cargarMovimientosCaja = async () => {
    setCargandoMovimientosCaja(true)

    const { data, error } = await supabase.rpc('obtener_movimientos_caja')

    if (error) {
      console.error('Error cargando movimientos de caja:', error)
      setMovimientosCaja([])
      setMensajeCaja('No se pudo cargar el historial de movimientos de caja.')
      setCargandoMovimientosCaja(false)
      return
    }

    setMovimientosCaja(data ?? [])
    setCargandoMovimientosCaja(false)
  }

  const cargarResumenCaja = async () => {
    setCargandoResumenCaja(true)

    const { data, error } = await supabase.rpc('resumen_caja')

    if (error) {
      console.error('Error cargando resumen de caja:', error)
      setResumenCaja(null)
      setMensajeCaja('No se pudo cargar el resumen de la caja.')
      setCargandoResumenCaja(false)
      return
    }

    setResumenCaja(data?.[0] ?? null)
    setCargandoResumenCaja(false)
  }

  useEffect(() => {
    if (perfil?.negocio_id) {
      cargarCajaActual(perfil.negocio_id)
      cargarResumenCaja()
      cargarMovimientosCaja()
    }
  }, [perfil?.negocio_id])

  const abrirCaja = async (e) => {
    e.preventDefault()
    setMensajeCaja('')

    const monto = Number(montoInicialCaja)

    if (montoInicialCaja === '' || Number.isNaN(monto) || monto < 0) {
      setMensajeCaja('Ingresa un monto inicial válido.')
      return
    }

    setAbriendoCaja(true)

    const { error } = await supabase.rpc('abrir_caja', {
      p_monto_inicial: monto,
    })

    if (error) {
      console.error('Error abriendo caja:', error)
      setMensajeCaja(error.message)
      setAbriendoCaja(false)
      return
    }

    await Promise.all([
      cargarCajaActual(perfil.negocio_id),
      cargarResumenCaja(),
      cargarMovimientosCaja(),
    ])
    setMontoInicialCaja('')
    setMensajeCaja('Caja abierta correctamente.')
    setAbriendoCaja(false)
  }

  const abrirMovimientoCaja = (tipo) => {
    setMensajeCaja('')
    setMovimientoCajaForm({
      tipo,
      categoria: tipo === 'entrada' ? 'ingreso' : 'gasto',
      monto: '',
      descripcion: '',
    })
    setMostrarMovimientoCaja(true)
  }

  const cerrarMovimientoCaja = () => {
    if (guardandoMovimientoCaja) return
    setMostrarMovimientoCaja(false)
    setMovimientoCajaForm({
      tipo: 'entrada',
      categoria: 'ingreso',
      monto: '',
      descripcion: '',
    })
  }

  const cambiarTipoMovimientoCaja = (tipo) => {
    setMovimientoCajaForm((actual) => ({
      ...actual,
      tipo,
      categoria: tipo === 'entrada' ? 'ingreso' : 'gasto',
    }))
  }

  const registrarMovimientoCaja = async (e) => {
    e.preventDefault()
    setMensajeCaja('')

    const monto = Number(movimientoCajaForm.monto)

    if (
      movimientoCajaForm.monto === '' ||
      Number.isNaN(monto) ||
      monto <= 0
    ) {
      setMensajeCaja('Ingresa un monto válido mayor a 0.')
      return
    }

    if (!movimientoCajaForm.categoria) {
      setMensajeCaja('Selecciona una categoría.')
      return
    }

    setGuardandoMovimientoCaja(true)

    const { error } = await supabase.rpc('registrar_movimiento_caja', {
      p_tipo: movimientoCajaForm.tipo,
      p_categoria: movimientoCajaForm.categoria,
      p_monto: monto,
      p_descripcion: movimientoCajaForm.descripcion.trim() || null,
    })

    if (error) {
      console.error('Error registrando movimiento de caja:', error)
      setMensajeCaja(error.message)
      setGuardandoMovimientoCaja(false)
      return
    }

    await Promise.all([
      cargarResumenCaja(),
      cargarMovimientosCaja(),
    ])

    setMostrarMovimientoCaja(false)
    setMovimientoCajaForm({
      tipo: 'entrada',
      categoria: 'ingreso',
      monto: '',
      descripcion: '',
    })
    setMensajeCaja(
      movimientoCajaForm.tipo === 'entrada'
        ? 'Entrada de efectivo registrada correctamente.'
        : 'Salida de efectivo registrada correctamente.'
    )
    setGuardandoMovimientoCaja(false)
  }

  const abrirCierreCaja = () => {
    setMensajeCaja('')
    setMontoFinalCaja('')
    setMostrarCierreCaja(true)
  }

  const cerrarModalCierreCaja = () => {
    if (cerrandoCaja) return
    setMostrarCierreCaja(false)
    setMontoFinalCaja('')
  }

  const confirmarCierreCaja = async (e) => {
    e.preventDefault()
    setMensajeCaja('')

    const montoDeclarado = Number(montoFinalCaja)

    if (montoFinalCaja === '' || Number.isNaN(montoDeclarado) || montoDeclarado < 0) {
      setMensajeCaja('Ingresa un efectivo contado válido.')
      return
    }

    setCerrandoCaja(true)

    const { error } = await supabase.rpc('cerrar_caja', {
      p_monto_final_declarado: montoDeclarado,
    })

    if (error) {
      console.error('Error cerrando caja:', error)
      setMensajeCaja(error.message)
      setCerrandoCaja(false)
      return
    }

    await Promise.all([
      cargarCajaActual(perfil.negocio_id),
      cargarResumenCaja(),
      cargarMovimientosCaja(),
    ])

    setMostrarCierreCaja(false)
    setMontoFinalCaja('')
    setMensajeCaja('Caja cerrada correctamente.')
    setCerrandoCaja(false)
  }

  const diferenciaCierreCaja =
    montoFinalCaja === '' || Number.isNaN(Number(montoFinalCaja))
      ? null
      : Number(montoFinalCaja) - Number(resumenCaja?.efectivo_esperado || 0)

  const estadoDiferenciaCaja =
    diferenciaCierreCaja === null
      ? 'Ingresa el efectivo contado'
      : diferenciaCierreCaja === 0
        ? 'Caja cuadrada'
        : diferenciaCierreCaja > 0
          ? 'Sobrante'
          : 'Faltante'

  const exportarCierresCajaExcel = async () => {
    setMensajeCaja('')

    if (!perfil?.negocio_id) {
      setMensajeCaja('No se pudo identificar el negocio.')
      return
    }

    const { data, error } = await supabase
      .from('cajas')
      .select(`
        id,
        monto_inicial,
        monto_final_declarado,
        total_ventas,
        total_efectivo,
        total_debito,
        total_credito,
        total_transferencia,
        total_otro,
        total_entradas,
        total_salidas,
        efectivo_esperado,
        diferencia,
        cantidad_ventas,
        abierta_en,
        cerrada_en,
        estado
      `)
      .eq('negocio_id', perfil.negocio_id)
      .eq('estado', 'cerrada')
      .order('cerrada_en', { ascending: false })

    if (error) {
      console.error('Error exportando cierres de caja:', error)
      setMensajeCaja('No se pudieron obtener los cierres de caja.')
      return
    }

    if (!data || data.length === 0) {
      setMensajeCaja('Aún no hay cajas cerradas para exportar.')
      return
    }

    const datosExcel = data.map((caja) => {
      const diferencia = Number(caja.diferencia || 0)

      const estadoArqueo =
        diferencia === 0
          ? 'Cuadrada'
          : diferencia > 0
            ? 'Sobrante'
            : 'Faltante'

      return {
        'Fecha apertura': formatearFechaCaja(caja.abierta_en),
        'Fecha cierre': formatearFechaCaja(caja.cerrada_en),
        'Monto inicial': Number(caja.monto_inicial || 0),
        'Ventas totales': Number(caja.total_ventas || 0),
        'Efectivo': Number(caja.total_efectivo || 0),
        'Débito': Number(caja.total_debito || 0),
        'Crédito': Number(caja.total_credito || 0),
        'Transferencia': Number(caja.total_transferencia || 0),
        'Otros': Number(caja.total_otro || 0),
        'Entradas': Number(caja.total_entradas || 0),
        'Salidas': Number(caja.total_salidas || 0),
        'Efectivo esperado': Number(caja.efectivo_esperado || 0),
        'Efectivo contado': Number(caja.monto_final_declarado || 0),
        'Diferencia': diferencia,
        'Estado arqueo': estadoArqueo,
        'N° ventas': Number(caja.cantidad_ventas || 0),
      }
    })

    const hoja = XLSX.utils.json_to_sheet(datosExcel)

    hoja['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 16 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 18 },
      { wch: 14 },
      { wch: 16 },
      { wch: 12 },
    ]

    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hoja, 'Cierres de caja')

    const hoy = new Date()
    const fecha = [
      String(hoy.getDate()).padStart(2, '0'),
      String(hoy.getMonth() + 1).padStart(2, '0'),
      hoy.getFullYear(),
    ].join('-')

    XLSX.writeFile(libro, `NOREVIK_Cierres_Caja_${fecha}.xlsx`)
    setMensajeCaja('Cierres de caja exportados correctamente.')
  }

  const formatearFechaCaja = (fecha) => {
    if (!fecha) return '—'

    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(fecha))
  }

  // =========================
  // CLIENTES
  // =========================

  const limpiarRutIngresado = (valor) => {
    return String(valor || '')
      .toUpperCase()
      .replace(/[^0-9K]/g, '')
      .slice(0, 9)
  }

  const formatearRutCompleto = (valor) => {
    const limpio = limpiarRutIngresado(valor)
    if (limpio.length < 2) return limpio

    const cuerpo = limpio.slice(0, -1)
    const dv = limpio.slice(-1)
    const cuerpoFormateado = Number(cuerpo).toLocaleString('es-CL')

    return `${cuerpoFormateado}-${dv}`
  }

  const validarRutChile = (valor) => {
    const limpio = limpiarRutIngresado(valor)
    if (limpio.length < 8 || limpio.length > 9) return false

    const cuerpo = limpio.slice(0, -1)
    const dvIngresado = limpio.slice(-1)

    let suma = 0
    let multiplicador = 2

    for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
      suma += Number(cuerpo[i]) * multiplicador
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
    }

    const resultado = 11 - (suma % 11)
    const dvCalculado =
      resultado === 11 ? '0' : resultado === 10 ? 'K' : String(resultado)

    return dvIngresado === dvCalculado
  }

  const cambiarRutCliente = (valor) => {
    setClienteForm((actual) => ({
      ...actual,
      rut: limpiarRutIngresado(valor),
    }))
  }

  const cambiarTelefonoCliente = (valor) => {
    let soloNumeros = String(valor || '').replace(/\D/g, '')
    if (soloNumeros.startsWith('56')) soloNumeros = soloNumeros.slice(2)
    soloNumeros = soloNumeros.slice(0, 9)
    setClienteForm((actual) => ({ ...actual, telefono: soloNumeros }))
  }

  const formatearTelefonoChile = (telefono) => {
    const numeros = String(telefono || '').replace(/\D/g, '').replace(/^56/, '')
    if (!numeros) return ''
    if (numeros.length <= 1) return numeros
    if (numeros.length <= 5) return `${numeros.slice(0, 1)} ${numeros.slice(1)}`
    return `${numeros.slice(0, 1)} ${numeros.slice(1, 5)} ${numeros.slice(5, 9)}`
  }

  const cargarClientes = async (negocioId) => {
    if (!negocioId) return

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('negocio_id', negocioId)
      .eq('activo', true)
      .order('creado_en', { ascending: false })

    if (error) {
      console.error('Error cargando clientes:', error)
      setMensajeCliente('No se pudieron cargar los clientes.')
      return
    }

    setClientes(data ?? [])
  }

  useEffect(() => {
    if (perfil?.negocio_id) {
      cargarClientes(perfil.negocio_id)
    }
  }, [perfil?.negocio_id])

  const limpiarFormularioCliente = () => {
    setClienteForm({
      nombre: '',
      rut: '',
      telefono: '',
      correo: '',
    })
    setClienteEditando(null)
  }

  const abrirNuevoCliente = () => {
    limpiarFormularioCliente()
    setMensajeCliente('')
    setMostrarFormularioCliente(true)
  }

  const abrirEditarCliente = (cliente) => {
    setClienteEditando(cliente)
    setClienteForm({
      nombre: cliente.nombre || '',
      rut: limpiarRutIngresado(cliente.rut),
      telefono: (cliente.telefono || '').replace(/^\+?56/, '').replace(/\D/g, ''),
      correo: cliente.correo || '',
    })
    setMensajeCliente('')
    setMostrarFormularioCliente(true)
  }

  const cerrarFormularioCliente = () => {
    if (guardandoCliente) return
    setMostrarFormularioCliente(false)
    limpiarFormularioCliente()
    setMensajeCliente('')
  }

  const solicitarEliminarCliente = (cliente) => {
    if (!cliente) return
    setClientePorEliminar(cliente)
    setMensajeCliente('')
  }

  const cerrarEliminarCliente = () => {
    if (eliminandoCliente) return
    setClientePorEliminar(null)
  }

  const eliminarCliente = async () => {
    if (!clientePorEliminar || !perfil?.negocio_id) return

    setEliminandoCliente(true)
    setMensajeCliente('')

    const { error } = await supabase
      .from('clientes')
      .update({ activo: false })
      .eq('id', clientePorEliminar.id)
      .eq('negocio_id', perfil.negocio_id)

    if (error) {
      console.error('Error eliminando cliente:', error)
      setMensajeCliente(error.message)
      setEliminandoCliente(false)
      return
    }

    await cargarClientes(perfil.negocio_id)

    setClientePorEliminar(null)
    setMostrarFormularioCliente(false)
    limpiarFormularioCliente()
    setMensajeCliente('Cliente eliminado correctamente.')
    setEliminandoCliente(false)
  }

  const guardarCliente = async (e) => {
    e.preventDefault()
    setMensajeCliente('')

    if (!perfil?.negocio_id) {
      setMensajeCliente('No se pudo identificar el negocio.')
      return
    }

    if (!clienteForm.nombre.trim()) {
      setMensajeCliente('Ingresa el nombre para continuar.')
      return
    }

    if (!clienteForm.rut.trim()) {
      setMensajeCliente('Ingresa el RUT para continuar.')
      return
    }

    if (!clienteForm.telefono.trim()) {
      setMensajeCliente('Ingresa el teléfono para continuar.')
      return
    }

    if (!clienteForm.correo.trim()) {
      setMensajeCliente('Ingresa el correo para continuar.')
      return
    }

    const rutCompleto = limpiarRutIngresado(clienteForm.rut)
    const telefonoNumerico = clienteForm.telefono.replace(/\D/g, '')

    if (!validarRutChile(rutCompleto)) {
      setMensajeCliente('El RUT ingresado no es válido.')
      return
    }

    if (telefonoNumerico && telefonoNumerico.length !== 9) {
      setMensajeCliente('El teléfono debe tener 9 dígitos después del +56.')
      return
    }

    const datosCliente = {
      negocio_id: perfil.negocio_id,
      nombre: clienteForm.nombre.trim(),
      rut: formatearRutCompleto(rutCompleto),
      telefono: telefonoNumerico ? `+56${telefonoNumerico}` : null,
      correo: clienteForm.correo.trim() || null,
      activo: true,
    }

    setGuardandoCliente(true)

    let resultado

    if (clienteEditando) {
      resultado = await supabase
        .from('clientes')
        .update(datosCliente)
        .eq('id', clienteEditando.id)
        .eq('negocio_id', perfil.negocio_id)
        .select()
        .single()
    } else {
      resultado = await supabase
        .from('clientes')
        .insert(datosCliente)
        .select()
        .single()
    }

    if (resultado.error) {
      console.error('Error guardando cliente:', resultado.error)
      setMensajeCliente(resultado.error.message)
      setGuardandoCliente(false)
      return
    }

    await cargarClientes(perfil.negocio_id)

    setMostrarFormularioCliente(false)
    limpiarFormularioCliente()
    setMensajeCliente(
      clienteEditando
        ? 'Cliente actualizado correctamente.'
        : 'Cliente registrado correctamente.'
    )
    setGuardandoCliente(false)
  }

  // =========================
  // PROVEEDORES
  // =========================

  const cambiarRutProveedor = (valor) => {
    setProveedorForm((actual) => ({
      ...actual,
      rut: limpiarRutIngresado(valor),
    }))
  }

  const cambiarTelefonoProveedor = (valor) => {
    let soloNumeros = String(valor || '').replace(/\D/g, '')
    if (soloNumeros.startsWith('56')) soloNumeros = soloNumeros.slice(2)
    soloNumeros = soloNumeros.slice(0, 9)
    setProveedorForm((actual) => ({ ...actual, telefono: soloNumeros }))
  }

  const cargarProveedores = async (negocioId) => {
    if (!negocioId) return

    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .eq('negocio_id', negocioId)
      .eq('activo', true)
      .order('creado_en', { ascending: false })

    if (error) {
      console.error('Error cargando proveedores:', error)
      setMensajeProveedor('No se pudieron cargar los proveedores.')
      return
    }

    setProveedores(data ?? [])
  }

  useEffect(() => {
    if (perfil?.negocio_id) {
      cargarProveedores(perfil.negocio_id)
    }
  }, [perfil?.negocio_id])

  const limpiarFormularioProveedor = () => {
    setProveedorForm({
      nombre: '',
      rut: '',
      telefono: '',
      correo: '',
      contacto: '',
    })
    setProveedorEditando(null)
  }

  const abrirNuevoProveedor = () => {
    limpiarFormularioProveedor()
    setMensajeProveedor('')
    setMostrarFormularioProveedor(true)
  }

  const abrirEditarProveedor = (proveedor) => {
    setProveedorEditando(proveedor)
    setProveedorForm({
      nombre: proveedor.nombre || '',
      rut: limpiarRutIngresado(proveedor.rut),
      telefono: (proveedor.telefono || '').replace(/^\+?56/, '').replace(/\D/g, ''),
      correo: proveedor.correo || '',
      contacto: proveedor.contacto || '',
    })
    setMensajeProveedor('')
    setMostrarFormularioProveedor(true)
  }

  const cerrarFormularioProveedor = () => {
    if (guardandoProveedor) return
    setMostrarFormularioProveedor(false)
    limpiarFormularioProveedor()
    setMensajeProveedor('')
  }

  const solicitarEliminarProveedor = (proveedor) => {
    if (!proveedor) return
    setProveedorPorEliminar(proveedor)
    setMensajeProveedor('')
  }

  const cerrarEliminarProveedor = () => {
    if (eliminandoProveedor) return
    setProveedorPorEliminar(null)
  }

  const eliminarProveedor = async () => {
    if (!proveedorPorEliminar || !perfil?.negocio_id) return

    setEliminandoProveedor(true)
    setMensajeProveedor('')

    const { error } = await supabase
      .from('proveedores')
      .update({ activo: false })
      .eq('id', proveedorPorEliminar.id)
      .eq('negocio_id', perfil.negocio_id)

    if (error) {
      console.error('Error eliminando proveedor:', error)
      setMensajeProveedor(error.message)
      setEliminandoProveedor(false)
      return
    }

    await cargarProveedores(perfil.negocio_id)

    setProveedorPorEliminar(null)
    setMostrarFormularioProveedor(false)
    limpiarFormularioProveedor()
    setMensajeProveedor('Proveedor eliminado correctamente.')
    setEliminandoProveedor(false)
  }

  const guardarProveedor = async (e) => {
    e.preventDefault()
    setMensajeProveedor('')

    if (!perfil?.negocio_id) {
      setMensajeProveedor('No se pudo identificar el negocio.')
      return
    }

    if (!proveedorForm.nombre.trim()) {
      setMensajeProveedor('Ingresa el nombre o razón social.')
      return
    }

    if (!proveedorForm.rut.trim()) {
      setMensajeProveedor('Ingresa el RUT para continuar.')
      return
    }

    const rutCompleto = limpiarRutIngresado(proveedorForm.rut)
    const telefonoNumerico = proveedorForm.telefono.replace(/\D/g, '')

    if (!validarRutChile(rutCompleto)) {
      setMensajeProveedor('El RUT ingresado no es válido.')
      return
    }

    if (telefonoNumerico && telefonoNumerico.length !== 9) {
      setMensajeProveedor('El teléfono debe tener 9 dígitos después del +56.')
      return
    }

    const datosProveedor = {
      negocio_id: perfil.negocio_id,
      nombre: proveedorForm.nombre.trim(),
      rut: formatearRutCompleto(rutCompleto),
      telefono: telefonoNumerico ? `+56${telefonoNumerico}` : null,
      correo: proveedorForm.correo.trim() || null,
      contacto: proveedorForm.contacto.trim() || null,
      activo: true,
    }

    setGuardandoProveedor(true)

    let resultado

    if (proveedorEditando) {
      resultado = await supabase
        .from('proveedores')
        .update(datosProveedor)
        .eq('id', proveedorEditando.id)
        .eq('negocio_id', perfil.negocio_id)
        .select()
        .single()
    } else {
      resultado = await supabase
        .from('proveedores')
        .insert(datosProveedor)
        .select()
        .single()
    }

    if (resultado.error) {
      console.error('Error guardando proveedor:', resultado.error)
      setMensajeProveedor(resultado.error.message)
      setGuardandoProveedor(false)
      return
    }

    await cargarProveedores(perfil.negocio_id)

    setMostrarFormularioProveedor(false)
    limpiarFormularioProveedor()
    setMensajeProveedor(
      proveedorEditando
        ? 'Proveedor actualizado correctamente.'
        : 'Proveedor registrado correctamente.'
    )
    setGuardandoProveedor(false)
  }

  // =========================
  // COMPRAS
  // =========================

  const cargarCompras = async (negocioId) => {
    if (!negocioId) return

    const { data, error } = await supabase
      .from('compras')
      .select(`
        id,
        total,
        metodo_pago,
        numero_documento,
        observaciones,
        estado,
        creado_en,
        proveedor_id,
        proveedores (
          nombre,
          rut
        ),
        detalle_compras (
          id,
          cantidad,
          costo_unitario,
          subtotal,
          productos (
            nombre,
            sku
          )
        )
      `)
      .eq('negocio_id', negocioId)
      .order('creado_en', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error cargando compras:', error)
      setMensajeCompra('No se pudo cargar el historial de compras.')
      return
    }

    setCompras(data ?? [])
  }

  useEffect(() => {
    if (perfil?.negocio_id) cargarCompras(perfil.negocio_id)
  }, [perfil?.negocio_id])

  useEffect(() => {
    if (!mensajeCompra) return
    const timer = setTimeout(() => setMensajeCompra(''), 3000)
    return () => clearTimeout(timer)
  }, [mensajeCompra])

  const agregarProductoCompra = (producto) => {
    setMensajeCompra('')
    setCarritoCompra((actual) => {
      if (actual.some((item) => item.id === producto.id)) return actual
      return [
        ...actual,
        {
          ...producto,
          cantidadCompra: 1,
          costoCompra: Number(producto.costo || 0),
        },
      ]
    })
  }

  const cambiarCantidadCompra = (productoId, valor) => {
    const cantidad = Math.max(1, parseInt(valor || '1', 10))
    setCarritoCompra((actual) =>
      actual.map((item) =>
        item.id === productoId ? { ...item, cantidadCompra: cantidad } : item
      )
    )
  }

  const cambiarCostoCompra = (productoId, valor) => {
    setCarritoCompra((actual) =>
      actual.map((item) =>
        item.id === productoId ? { ...item, costoCompra: valor } : item
      )
    )
  }

  const quitarProductoCompra = (productoId) => {
    setCarritoCompra((actual) => actual.filter((item) => item.id !== productoId))
  }

  const totalCompra = carritoCompra.reduce(
    (total, item) =>
      total +
      Number(item.cantidadCompra || 0) * Number(item.costoCompra || 0),
    0
  )

  const registrarCompra = async (e) => {
    e.preventDefault()
    setMensajeCompra('')

    if (!proveedorCompraId) {
      setMensajeCompra('Selecciona un proveedor.')
      return
    }

    if (carritoCompra.length === 0) {
      setMensajeCompra('Agrega al menos un producto a la compra.')
      return
    }

    const productosCompra = carritoCompra.map((item) => ({
      producto_id: item.id,
      cantidad: Number(item.cantidadCompra),
      costo_unitario: Number(item.costoCompra),
    }))

    if (
      productosCompra.some(
        (item) =>
          !Number.isInteger(item.cantidad) ||
          item.cantidad <= 0 ||
          Number.isNaN(item.costo_unitario) ||
          item.costo_unitario < 0
      )
    ) {
      setMensajeCompra('Revisa las cantidades y costos de la compra.')
      return
    }

    setGuardandoCompra(true)

    const { error } = await supabase.rpc('registrar_compra', {
      p_proveedor_id: proveedorCompraId,
      p_metodo_pago: metodoPagoCompra,
      p_productos: productosCompra,
      p_numero_documento: numeroDocumentoCompra.trim() || null,
      p_observaciones: observacionesCompra.trim() || null,
    })

    if (error) {
      console.error('Error registrando compra:', error)
      setMensajeCompra(error.message)
      setGuardandoCompra(false)
      return
    }

    await Promise.all([
      cargarProductos(perfil.negocio_id),
      cargarMovimientosInventario(perfil.negocio_id),
      cargarCompras(perfil.negocio_id),
      cargarCajaActual(perfil.negocio_id),
      cargarResumenCaja(),
      cargarMovimientosCaja(),
    ])

    setCarritoCompra([])
    setProveedorCompraId('')
    setMetodoPagoCompra('transferencia')
    setNumeroDocumentoCompra('')
    setObservacionesCompra('')
    setBusquedaCompra('')
    setMensajeCompra('Compra registrada. El stock y costo promedio fueron actualizados.')
    setGuardandoCompra(false)
  }

  const abrirDetalleCompra = (compra) => {
    setCompraDetalle(compra)
    setMensajeCompra('')
  }

  const cerrarDetalleCompra = () => {
    if (anulandoCompra) return
    setCompraDetalle(null)
  }

  const solicitarAnulacionCompra = (compra) => {
    if (!compra || compra.estado === 'anulada') return
    setCompraPorAnular(compra)
  }

  const cerrarConfirmacionAnulacionCompra = () => {
    if (anulandoCompra) return
    setCompraPorAnular(null)
  }

  const anularCompra = async () => {
    const compra = compraPorAnular

    if (!compra || compra.estado === 'anulada') return

    setAnulandoCompra(true)
    setMensajeCompra('')

    const { error } = await supabase.rpc('anular_compra', {
      p_compra_id: compra.id,
    })

    if (error) {
      console.error('Error anulando compra:', error)
      setMensajeCompra(error.message)
      setAnulandoCompra(false)
      return
    }

    await Promise.all([
  cargarProductos(perfil.negocio_id),
  cargarMovimientosInventario(perfil.negocio_id),
  cargarCompras(perfil.negocio_id),
  cargarCajaActual(perfil.negocio_id),
  cargarResumenCaja(),
  cargarMovimientosCaja(),
])

    setCompraDetalle(null)
    setCompraPorAnular(null)
    setMensajeCompra(
      'Compra anulada correctamente. Las unidades fueron descontadas del inventario.'
    )
    setAnulandoCompra(false)
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
        setCorreo('')
        setPassword('')
        setMensaje('')

        // Mantiene visible la transición de inicio de sesión antes de entrar al panel.
        await new Promise((resolve) => setTimeout(resolve, 900))

        setUsuario(data.user)
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
    setConfirmarCerrarSesion(false)
    if (cerrandoSesion) return

    setCerrandoSesion(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error(error)
        setCerrandoSesion(false)
        return
      }

      setUsuario(null)
      setCorreo('')
      setPassword('')
      setMensaje('')

      // Pequeña pausa para que la transición de cierre se alcance a ver.
      await new Promise((resolve) => setTimeout(resolve, 900))
    } finally {
      setCerrandoSesion(false)
    }
  }

  // =========================
  // CERRANDO SESIÓN
  // =========================

  if (cerrandoSesion) {
    return (
      <div className="logout-screen">
        <div className="logout-screen-content">
          <div className="logout-screen-logo">N</div>
          <h1>NOREVIK</h1>
          <p>Tu negocio en movimiento.</p>
          <div className="logout-spinner" aria-hidden="true" />
          <span>Cerrando sesión...</span>
        </div>
      </div>
    )
  }

  // =========================
  // INICIANDO SESIÓN
  // =========================

  if (cargando && !modoRegistro) {
    return (
      <div className="logout-screen">
        <div className="logout-screen-content">
          <div className="logout-screen-logo">N</div>
          <h1>NOREVIK</h1>
          <p>Tu negocio en movimiento.</p>
          <div className="logout-spinner" aria-hidden="true" />
          <span>Iniciando sesión...</span>
        </div>
      </div>
    )
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

  const stockTotal = productos.reduce(
    (total, producto) => total + Number(producto.stock || 0),
    0
  )

  const productosStockBajo = productos.filter(
    (producto) =>
      Number(producto.stock) > 0 &&
      Number(producto.stock) <= Number(producto.stock_minimo)
  ).length

  const productosSinStock = productos.filter(
    (producto) => Number(producto.stock) === 0
  ).length

  const productosInventarioFiltrados = productos.filter((producto) => {
    const termino = busquedaInventario.trim().toLowerCase()

    if (!termino) return true

    return (
      producto.nombre?.toLowerCase().includes(termino) ||
      producto.sku?.toLowerCase().includes(termino) ||
      producto.categoria?.toLowerCase().includes(termino)
    )
  })

  const productosVentaFiltrados = productos.filter((producto) => {
    const termino = busquedaVenta.trim().toLowerCase()

    if (!termino) return true

    return (
      producto.nombre?.toLowerCase().includes(termino) ||
      producto.sku?.toLowerCase().includes(termino) ||
      producto.categoria?.toLowerCase().includes(termino)
    )
  })

  const productosCompraFiltrados = productos.filter((producto) => {
    const termino = busquedaCompra.trim().toLowerCase()
    if (!termino) return true
    return (
      producto.nombre?.toLowerCase().includes(termino) ||
      producto.sku?.toLowerCase().includes(termino) ||
      producto.categoria?.toLowerCase().includes(termino)
    )
  })

  const totalCarrito = carrito.reduce(
    (total, item) =>
      total + Number(item.precio_venta || 0) * Number(item.cantidad || 0),
    0
  )

  const hoyClave = new Date().toLocaleDateString('en-CA')
  const ventasHoy = ventas.filter(
    (venta) =>
      venta.estado === 'completada' &&
      new Date(venta.creado_en).toLocaleDateString('en-CA') === hoyClave
  )
  const ingresosHoy = ventasHoy.reduce(
    (total, venta) => total + Number(venta.total || 0),
    0
  )

  const clientesFiltrados = clientes.filter((cliente) => {
    const termino = busquedaCliente.trim().toLowerCase()

    if (!termino) return true

    return (
      cliente.nombre?.toLowerCase().includes(termino) ||
      cliente.rut?.toLowerCase().includes(termino) ||
      cliente.telefono?.toLowerCase().includes(termino) ||
      cliente.correo?.toLowerCase().includes(termino)
    )
  })

  const proveedoresFiltrados = proveedores.filter((proveedor) => {
    const termino = busquedaProveedor.trim().toLowerCase()

    if (!termino) return true

    return (
      proveedor.nombre?.toLowerCase().includes(termino) ||
      proveedor.rut?.toLowerCase().includes(termino) ||
      proveedor.telefono?.toLowerCase().includes(termino) ||
      proveedor.correo?.toLowerCase().includes(termino) ||
      proveedor.contacto?.toLowerCase().includes(termino)
    )
  })

  return (
    <div className="dashboard">

      {mostrarCierreCaja && cajaActual && (
        <div className="cash-close-backdrop">
          <div className="cash-close-modal" role="dialog" aria-modal="true" aria-labelledby="cash-close-title">
            <div className="cash-close-modal-header">
              <div>
                <span className="cash-close-kicker">ARQUEO DE CAJA</span>
                <h2 id="cash-close-title">Cerrar caja</h2>
                <p>Cuenta el efectivo físico disponible antes de confirmar el cierre.</p>
              </div>

              <button
                type="button"
                className="cash-close-x"
                onClick={cerrarModalCierreCaja}
                disabled={cerrandoCaja}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="cash-close-expected">
              <span>Efectivo esperado</span>
              <strong>
                ${Number(resumenCaja?.efectivo_esperado || 0).toLocaleString('es-CL')}
              </strong>
              <small>Inicial + ventas en efectivo + entradas − salidas</small>
            </div>

            <form className="cash-close-form" onSubmit={confirmarCierreCaja}>
              <label htmlFor="monto-final-caja">Efectivo contado</label>

              <div className="cash-close-money-input">
                <span>$</span>
                <input
                  id="monto-final-caja"
                  type="number"
                  min="0"
                  step="1"
                  value={montoFinalCaja}
                  onChange={(e) => setMontoFinalCaja(e.target.value)}
                  placeholder="0"
                  autoFocus
                  disabled={cerrandoCaja}
                />
              </div>

              <div
                className={`cash-close-difference ${
                  diferenciaCierreCaja === null
                    ? 'neutral'
                    : diferenciaCierreCaja === 0
                      ? 'balanced'
                      : diferenciaCierreCaja > 0
                        ? 'surplus'
                        : 'shortage'
                }`}
              >
                <div>
                  <span>Diferencia</span>
                  <strong>
                    {diferenciaCierreCaja === null
                      ? '—'
                      : `${diferenciaCierreCaja > 0 ? '+' : diferenciaCierreCaja < 0 ? '−' : ''}$${Math.abs(diferenciaCierreCaja).toLocaleString('es-CL')}`}
                  </strong>
                </div>

                <span className="cash-close-status">{estadoDiferenciaCaja}</span>
              </div>

              <div className="cash-close-warning">
                Al confirmar, esta caja quedará cerrada y sus totales serán guardados.
              </div>

              <div className="cash-close-actions">
                <button
                  type="button"
                  className="cash-close-cancel"
                  onClick={cerrarModalCierreCaja}
                  disabled={cerrandoCaja}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="cash-close-confirm"
                  disabled={cerrandoCaja}
                >
                  {cerrandoCaja ? 'Cerrando...' : 'Confirmar cierre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      
        {confirmarCerrarSesion && !cerrandoSesion && (
          <div className="logout-confirm-backdrop">
            <div className="logout-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title">
              <div className="logout-confirm-icon">↪</div>
              <h2 id="logout-confirm-title">¿Cerrar sesión?</h2>
              <p>Tu sesión actual se cerrará y volverás a la pantalla de inicio de sesión.</p>

              <div className="logout-confirm-actions">
                <button
                  type="button"
                  className="logout-confirm-cancel"
                  onClick={() => setConfirmarCerrarSesion(false)}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="logout-confirm-accept"
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}

{/* MENÚ MÓVIL */}
      <header className="mobile-topbar">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuMovilAbierto((actual) => !actual)}
          aria-label={menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuMovilAbierto}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="mobile-brand">
          <div className="mobile-brand-logo">N</div>
          <div>
            <strong>NOREVIK</strong>
            <span>Gestión de negocio</span>
          </div>
        </div>
      </header>

      <button
        type="button"
        className={`mobile-sidebar-overlay ${menuMovilAbierto ? 'visible' : ''}`}
        onClick={() => setMenuMovilAbierto(false)}
        aria-label="Cerrar menú"
      />

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuMovilAbierto ? 'mobile-open' : ''}`}>

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
            <span>🏠</span>
            Panel de control
          </button>

          <button
            className={`menu-item ${seccion === 'ventas' ? 'active' : ''}`}
            onClick={() => setSeccion('ventas')}
          >
            <span>🧾</span>
            Ventas
          </button>

          <button
            className={`menu-item ${
              seccion === 'productos' ? 'active' : ''
            }`}
            onClick={() => setSeccion('productos')}
          >
            <span>📦</span>
            Productos
          </button>

          <button
            className={`menu-item ${
              seccion === 'inventario' ? 'active' : ''
            }`}
            onClick={() => setSeccion('inventario')}
          >
            <span>📋</span>
            Inventario
          </button>

          <button
            className={`menu-item ${seccion === 'caja' ? 'active' : ''}`}
            onClick={() => setSeccion('caja')}
          >
            <span>💰</span>
            Caja
          </button>

          <button
            className={`menu-item ${seccion === 'clientes' ? 'active' : ''}`}
            onClick={() => setSeccion('clientes')}
          >
            <span>👤</span>
            Clientes
          </button>

          <button
            className={`menu-item ${seccion === 'proveedores' ? 'active' : ''}`}
            onClick={() => setSeccion('proveedores')}
          >
            <span>🚚</span>
            Proveedores
          </button>
          <button
            className={`menu-item ${seccion === 'compras' ? 'active' : ''}`}
            onClick={() => setSeccion('compras')}
          >
            <span>🛒</span>
            Compras
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
            onClick={() => setConfirmarCerrarSesion(true)}
            disabled={cerrandoSesion}
          >
            {cerrandoSesion ? 'Cerrando...' : 'Cerrar sesión'}
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

                <strong className="stat-value">{ventasHoy.length}</strong>

                <span className="stat-detail">
                  {ventasHoy.length === 1 ? 'Venta registrada hoy' : 'Ventas registradas hoy'}
                </span>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Ingresos de hoy</span>
                  <div className="stat-icon">$</div>
                </div>

                <strong className="stat-value">${ingresosHoy.toLocaleString('es-CL')}</strong>

                <span className="stat-detail">
                  Total vendido hoy
                </span>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Productos</span>
                  <div className="stat-icon">📦</div>
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

                <button
                  className="quick-card"
                  onClick={() => setSeccion('ventas')}
                >
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

                <button
                  className="quick-card"
                  onClick={() => setSeccion('inventario')}
                >
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

                  <button onClick={() => setSeccion('ventas')}>Ver todas</button>
                </div>

                {ventas.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <strong>Aún no hay ventas</strong>
                    <span>Las ventas que registres aparecerán aquí.</span>
                  </div>
                ) : (
                  <div className="recent-sales-list">
                    {ventas.slice(0, 5).map((venta) => (
                      <div className="recent-sale-row" key={venta.id}>
                        <div>
                          <strong>${Number(venta.total || 0).toLocaleString('es-CL')}</strong>
                          <span>{formatearFechaVenta(venta.creado_en)}</span>
                        </div>
                        <span className="sale-payment">
                          {venta.metodo_pago}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </article>

              <article className="dashboard-panel">

                <div className="panel-heading">
                  <div>
                    <h2>Productos destacados</h2>
                    <p>Productos con mayor movimiento</p>
                  </div>
                </div>

                <div className="empty-state">
                  <div className="empty-icon">📦</div>

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
        {/* VENTAS */}
        {/* ========================= */}

        {seccion === 'ventas' && (
          <>
            <header className="dashboard-header">
              <div>
                <span className="dashboard-label">VENTAS</span>
                <h1>Ventas</h1>
                <p>Registra ventas y descuenta el stock automáticamente.</p>
              </div>

              <div className="business-name">
                <span>Negocio</span>
                <strong>{negocio}</strong>
              </div>
            </header>

            {mensajeVenta && (
              <p className="auth-message sales-message">{mensajeVenta}</p>
            )}

            <section className="sales-layout">
              <article className="dashboard-panel sales-products-panel">
                <div className="panel-heading sales-heading">
                  <div>
                    <h2>Seleccionar productos</h2>
                    <p>Agrega productos disponibles a la venta.</p>
                  </div>
                </div>

                <div className="sales-search">
                  <input
                    type="search"
                    value={busquedaVenta}
                    onChange={(e) => setBusquedaVenta(e.target.value)}
                    placeholder="Buscar por producto, SKU o categoría..."
                  />
                </div>

                {productosVentaFiltrados.length === 0 ? (
                  <div className="empty-state">
                    <strong>No hay productos disponibles</strong>
                    <span>Agrega productos o prueba con otra búsqueda.</span>
                  </div>
                ) : (
                  <div className="sale-product-list">
                    {productosVentaFiltrados.map((producto) => {
                      const sinStock = Number(producto.stock || 0) <= 0

                      return (
                        <div className="sale-product-card" key={producto.id}>
                          <div className="sale-product-info">
                            <strong>{producto.nombre}</strong>
                            <span>
                              {producto.sku || 'Sin SKU'} · Stock: {producto.stock}
                            </span>
                          </div>

                          <div className="sale-product-action">
                            <strong>
                              ${Number(producto.precio_venta || 0).toLocaleString('es-CL')}
                            </strong>
                            <button
                              type="button"
                              onClick={() => agregarAlCarrito(producto)}
                              disabled={sinStock}
                            >
                              {sinStock ? 'Sin stock' : '+ Agregar'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </article>

              <article className="dashboard-panel sale-cart-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Venta actual</h2>
                    <p>{carrito.length} producto{carrito.length === 1 ? '' : 's'} diferente{carrito.length === 1 ? '' : 's'}</p>
                  </div>
                </div>

                {carrito.length === 0 ? (
                  <div className="empty-state sale-cart-empty">
                    <div className="empty-icon">📦</div>
                    <strong>La venta está vacía</strong>
                    <span>Selecciona productos para comenzar.</span>
                  </div>
                ) : (
                  <div className="cart-items">
                    {carrito.map((item) => (
                      <div className="cart-item" key={item.id}>
                        <div className="cart-item-top">
                          <div>
                            <strong>{item.nombre}</strong>
                            <span>
                              ${Number(item.precio_venta || 0).toLocaleString('es-CL')} c/u
                            </span>
                          </div>

                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() => quitarDelCarrito(item.id)}
                            title="Quitar producto"
                          >
                            ×
                          </button>
                        </div>

                        <div className="cart-item-bottom">
                          <div className="quantity-control">
                            <button
                              type="button"
                              onClick={() =>
                                cambiarCantidadCarrito(item.id, item.cantidad - 1)
                              }
                            >
                              −
                            </button>
                            <strong>{item.cantidad}</strong>
                            <button
                              type="button"
                              onClick={() =>
                                cambiarCantidadCarrito(item.id, item.cantidad + 1)
                              }
                              disabled={item.cantidad >= Number(item.stock || 0)}
                            >
                              +
                            </button>
                          </div>

                          <strong>
                            ${(Number(item.precio_venta || 0) * item.cantidad).toLocaleString('es-CL')}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="sale-checkout">
                  <div className="form-group">
                    <label>Cliente</label>
                    <select
                      value={clienteVentaId}
                      onChange={(e) => setClienteVentaId(e.target.value)}
                    >
                      <option value="">Cliente general / Sin identificar</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre}{cliente.rut ? ` · ${cliente.rut}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Método de pago</label>
                    <select
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="debito">Débito</option>
                      <option value="credito">Crédito</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="sale-total">
                    <span>Total</span>
                    <strong>${totalCarrito.toLocaleString('es-CL')}</strong>
                  </div>

                  <button
                    type="button"
                    className="login-button register-sale-button"
                    onClick={registrarVenta}
                    disabled={guardandoVenta || carrito.length === 0}
                  >
                    {guardandoVenta ? 'Registrando...' : 'Registrar venta'}
                  </button>
                </div>
              </article>
            </section>

            <section className="dashboard-panel sales-history-panel">
              <div className="panel-heading">
                <div>
                  <h2>Historial de ventas</h2>
                  <p>Últimas operaciones registradas en NOREVIK.</p>
                </div>
              </div>

              {ventas.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">▣</div>
                  <strong>Aún no hay ventas</strong>
                  <span>Tu primera venta aparecerá aquí.</span>
                </div>
              ) : (
                <div className="products-table-wrap">
                  <table className="products-table sales-history-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Productos</th>
                        <th>Método de pago</th>
                        <th>Estado</th>
                        <th>Total</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.map((venta) => (
                        <tr key={venta.id}>
                          <td>{formatearFechaVenta(venta.creado_en)}</td>
                          <td>
                            <strong>{venta.clientes?.nombre || 'Cliente general'}</strong>
                            {venta.clientes?.rut && (
                              <div className="sale-client-rut">{venta.clientes.rut}</div>
                            )}
                          </td>
                          <td>
                            <div className="sale-detail-products">
                              {(venta.detalle_ventas || []).map((detalle) => (
                                <span key={detalle.id}>
                                  {detalle.productos?.nombre || 'Producto'} × {detalle.cantidad}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="capitalize">{venta.metodo_pago}</td>
                          <td>
                            <span className={`sale-status ${venta.estado}`}>
                              {venta.estado === 'completada' ? 'Completada' : 'Anulada'}
                            </span>
                          </td>
                          <td>
                            <strong>
                              ${Number(venta.total || 0).toLocaleString('es-CL')}
                            </strong>
                          </td>
                          <td>
                            <div className="sale-row-actions">
                              <button
                                type="button"
                                className="sale-detail-button"
                                onClick={() => abrirDetalleVenta(venta)}
                              >
                                Ver detalle
                              </button>
                              {venta.estado !== 'anulada' && (
                                <button
                                  type="button"
                                  className="sale-cancel-button"
                                  onClick={() => solicitarAnulacionVenta(venta)}
                                  disabled={anulandoVenta}
                                >
                                  Anular
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {ventaDetalle && (
              <div className="sale-modal-backdrop" onClick={cerrarDetalleVenta}>
                <div
                  className="sale-detail-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sale-detail-header">
                    <div>
                      <span className="dashboard-label">DETALLE DE VENTA</span>
                      <h2>Venta registrada</h2>
                      <p>{formatearFechaVenta(ventaDetalle.creado_en)}</p>
                    </div>

                    <button
                      type="button"
                      className="stock-modal-close"
                      onClick={cerrarDetalleVenta}
                      disabled={anulandoVenta}
                    >
                      ×
                    </button>
                  </div>

                  <div className="sale-detail-summary">
                    <div>
                      <span>Cliente</span>
                      <strong>{ventaDetalle.clientes?.nombre || 'Cliente general'}</strong>
                      {ventaDetalle.clientes?.rut && (
                        <small>{ventaDetalle.clientes.rut}</small>
                      )}
                    </div>
                    <div>
                      <span>Método de pago</span>
                      <strong className="capitalize">{ventaDetalle.metodo_pago}</strong>
                    </div>
                    <div>
                      <span>Estado</span>
                      <span className={`sale-status ${ventaDetalle.estado}`}>
                        {ventaDetalle.estado === 'completada' ? 'Completada' : 'Anulada'}
                      </span>
                    </div>
                  </div>

                  <div className="sale-detail-items">
                    <div className="sale-detail-items-header">
                      <span>Producto</span>
                      <span>Subtotal</span>
                    </div>

                    {(ventaDetalle.detalle_ventas || []).map((detalle) => (
                      <div className="sale-detail-item" key={detalle.id}>
                        <div>
                          <strong>{detalle.productos?.nombre || 'Producto'}</strong>
                          <span>
                            {detalle.cantidad} × ${Number(detalle.precio_unitario || 0).toLocaleString('es-CL')}
                          </span>
                        </div>

                        <strong>
                          ${Number(detalle.subtotal || 0).toLocaleString('es-CL')}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="sale-detail-total">
                    <span>Total de la venta</span>
                    <strong>
                      ${Number(ventaDetalle.total || 0).toLocaleString('es-CL')}
                    </strong>
                  </div>

                  <div className="sale-detail-actions">
                    <button
                      type="button"
                      onClick={cerrarDetalleVenta}
                      disabled={anulandoVenta}
                    >
                      Cerrar
                    </button>

                    {ventaDetalle.estado !== 'anulada' && (
                      <button
                        type="button"
                        className="sale-cancel-confirm"
                        onClick={() => solicitarAnulacionVenta(ventaDetalle)}
                        disabled={anulandoVenta}
                      >
                        {anulandoVenta ? 'Anulando...' : 'Anular venta'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {ventaPorAnular && (
              <div
                className="sale-modal-backdrop"
                onClick={cerrarConfirmacionAnulacion}
              >
                <div
                  className="norevik-confirm-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="norevik-confirm-icon">!</div>

                  <span className="dashboard-label">NOREVIK</span>
                  <h2>Anular venta</h2>

                  <p>
                    ¿Deseas anular esta venta por{' '}
                    <strong>
                      ${Number(ventaPorAnular.total || 0).toLocaleString('es-CL')}
                    </strong>
                    ?
                  </p>

                  <div className="norevik-confirm-info">
                    Las unidades vendidas serán devueltas automáticamente al
                    inventario y la venta quedará marcada como anulada.
                  </div>

                  <div className="norevik-confirm-actions">
                    <button
                      type="button"
                      className="norevik-confirm-cancel"
                      onClick={cerrarConfirmacionAnulacion}
                      disabled={anulandoVenta}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="norevik-confirm-danger"
                      onClick={anularVenta}
                      disabled={anulandoVenta}
                    >
                      {anulandoVenta ? 'Anulando...' : 'Anular venta'}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                    Exportar Catálogo
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
                  <div className="empty-icon">📦</div>
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

        {/* ========================= */}
        {/* INVENTARIO */}
        {/* ========================= */}

        {seccion === 'inventario' && (
          <>
            <header className="dashboard-header">
              <div>
                <span className="dashboard-label">INVENTARIO</span>
                <h1>Inventario</h1>
                <p>
                  Controla las existencias y detecta productos que necesitan reposición.
                </p>
              </div>

              <div className="business-name">
                <span>Negocio</span>
                <strong>{negocio}</strong>
              </div>
            </header>

            <section className="dashboard-stats inventory-stats">
              <article className="stat-card">
                <div className="stat-top">
                  <span>Unidades en stock</span>
                  <div className="stat-icon">📊</div>
                </div>
                <strong className="stat-value">{stockTotal}</strong>
                <span className="stat-detail">Stock total disponible</span>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Productos</span>
                  <div className="stat-icon">📦</div>
                </div>
                <strong className="stat-value">{productos.length}</strong>
                <span className="stat-detail">Productos en inventario</span>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Stock bajo</span>
                  <div className="stat-icon">⚠️</div>
                </div>
                <strong className="stat-value">{productosStockBajo}</strong>
                <span className="stat-detail">Necesitan reposición</span>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Sin stock</span>
                  <div className="stat-icon">🚫</div>
                </div>
                <strong className="stat-value">{productosSinStock}</strong>
                <span className="stat-detail">Productos agotados</span>
              </article>
            </section>

            <section className="dashboard-panel inventory-panel">
              <div className="panel-heading inventory-heading">
                <div>
                  <h2>Existencias</h2>
                  <p>Consulta el stock actual de todos tus productos.</p>
                </div>

                <div className="inventory-search">
                  <input
                    type="search"
                    value={busquedaInventario}
                    onChange={(e) => setBusquedaInventario(e.target.value)}
                    placeholder="Buscar por producto, SKU o categoría..."
                  />
                </div>
              </div>

              {cargandoProductos ? (
                <div className="empty-state">
                  <strong>Cargando inventario...</strong>
                </div>
              ) : productos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">▤</div>
                  <strong>Aún no hay inventario</strong>
                  <span>Agrega productos para comenzar a controlar tus existencias.</span>
                </div>
              ) : productosInventarioFiltrados.length === 0 ? (
                <div className="empty-state">
                  <strong>No encontramos productos</strong>
                  <span>Prueba con otro nombre, SKU o categoría.</span>
                </div>
              ) : (
                <div className="products-table-wrap">
                  <table className="products-table inventory-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>SKU</th>
                        <th>Categoría</th>
                        <th>Stock actual</th>
                        <th>Stock mínimo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosInventarioFiltrados.map((producto) => {
                        const stock = Number(producto.stock || 0)
                        const stockMinimo = Number(producto.stock_minimo || 0)
                        const sinStock = stock === 0
                        const stockBajo = stock > 0 && stock <= stockMinimo

                        return (
                          <tr key={producto.id}>
                            <td><strong>{producto.nombre}</strong></td>
                            <td>{producto.sku || '—'}</td>
                            <td>{producto.categoria || '—'}</td>
                            <td><strong>{stock}</strong></td>
                            <td>{stockMinimo}</td>
                            <td>
                              <span
                                className={
                                  sinStock
                                    ? 'product-status out'
                                    : stockBajo
                                      ? 'product-status low'
                                      : 'product-status ok'
                                }
                              >
                                {sinStock
                                  ? 'Sin stock'
                                  : stockBajo
                                    ? 'Stock bajo'
                                    : 'Disponible'}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="stock-move-button"
                                onClick={() => abrirMovimientoStock(producto)}
                              >
                                Mover stock
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {productoMovimiento && (
              <div className="stock-modal-backdrop" onClick={cerrarMovimientoStock}>
                <div
                  className="stock-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="stock-modal-header">
                    <div>
                      <span className="dashboard-label">MOVIMIENTO DE STOCK</span>
                      <h2>{productoMovimiento.nombre}</h2>
                      <p>
                        Stock actual: <strong>{productoMovimiento.stock}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="stock-modal-close"
                      onClick={cerrarMovimientoStock}
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={registrarMovimientoStock}>
                    <div className="stock-type-selector">
                      <button
                        type="button"
                        className={movimientoForm.tipo === 'entrada' ? 'active' : ''}
                        onClick={() =>
                          setMovimientoForm({
                            ...movimientoForm,
                            tipo: 'entrada',
                          })
                        }
                      >
                        + Entrada
                      </button>

                      <button
                        type="button"
                        className={movimientoForm.tipo === 'salida' ? 'active' : ''}
                        onClick={() =>
                          setMovimientoForm({
                            ...movimientoForm,
                            tipo: 'salida',
                          })
                        }
                      >
                        − Salida
                      </button>

                      <button
                        type="button"
                        className={movimientoForm.tipo === 'ajuste' ? 'active' : ''}
                        onClick={() =>
                          setMovimientoForm({
                            ...movimientoForm,
                            tipo: 'ajuste',
                          })
                        }
                      >
                        Ajustar
                      </button>
                    </div>

                    <div className="form-group">
                      <label>
                        {movimientoForm.tipo === 'ajuste'
                          ? 'Nuevo stock'
                          : 'Cantidad'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={movimientoForm.cantidad}
                        onChange={(e) =>
                          setMovimientoForm({
                            ...movimientoForm,
                            cantidad: e.target.value,
                          })
                        }
                        placeholder={
                          movimientoForm.tipo === 'ajuste'
                            ? 'Ej: 25'
                            : 'Ej: 10'
                        }
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <label>Motivo</label>
                      <input
                        type="text"
                        value={movimientoForm.motivo}
                        onChange={(e) =>
                          setMovimientoForm({
                            ...movimientoForm,
                            motivo: e.target.value,
                          })
                        }
                        placeholder={
                          movimientoForm.tipo === 'entrada'
                            ? 'Ej: Reposición de mercadería'
                            : movimientoForm.tipo === 'salida'
                              ? 'Ej: Producto dañado'
                              : 'Ej: Corrección de inventario'
                        }
                      />
                    </div>

                    <div className="stock-modal-actions">
                      <button
                        type="button"
                        onClick={cerrarMovimientoStock}
                        disabled={guardandoMovimiento}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="login-button"
                        disabled={guardandoMovimiento}
                      >
                        {guardandoMovimiento
                          ? 'Guardando...'
                          : 'Confirmar movimiento'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {mensajeInventario && (
              <p className="auth-message inventory-message">
                {mensajeInventario}
              </p>
            )}

            <section className="dashboard-panel inventory-history-panel">
              <div className="panel-heading">
                <div>
                  <h2>Historial de movimientos</h2>
                  <p>Últimos cambios realizados en el inventario.</p>
                </div>
              </div>

              {movimientosInventario.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">↕</div>
                  <strong>Aún no hay movimientos</strong>
                  <span>Las entradas, salidas y ajustes aparecerán aquí.</span>
                </div>
              ) : (
                <div className="products-table-wrap">
                  <table className="products-table inventory-history-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Stock</th>
                        <th>Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimientosInventario.map((movimiento) => (
                        <tr key={movimiento.id}>
                          <td>{formatearFechaMovimiento(movimiento.creado_en)}</td>
                          <td>
                            <strong>
                              {movimiento.productos?.nombre || 'Producto'}
                            </strong>
                            <span className="movement-sku">
                              {movimiento.productos?.sku || ''}
                            </span>
                          </td>
                          <td>
                            <span className={`movement-type ${movimiento.tipo}`}>
                              {movimiento.tipo === 'entrada'
                                ? 'Entrada'
                                : movimiento.tipo === 'salida'
                                  ? 'Salida'
                                  : 'Ajuste'}
                            </span>
                          </td>
                          <td>
                            <strong>
                              {movimiento.tipo === 'entrada'
                                ? `+${movimiento.cantidad}`
                                : movimiento.tipo === 'salida'
                                  ? `−${movimiento.cantidad}`
                                  : movimiento.cantidad}
                            </strong>
                          </td>
                          <td>
                            {movimiento.stock_anterior} → {movimiento.stock_nuevo}
                          </td>
                          <td>{movimiento.motivo || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* ========================= */}
        {/* CAJA */}
        {/* ========================= */}

        {seccion === 'caja' && (
          <>
            {mostrarMovimientoCaja && (
              <div className="cash-movement-backdrop">
                <div
                  className="cash-movement-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="cash-movement-title"
                >
                  <div className="cash-movement-modal-header">
                    <div>
                      <span className="dashboard-label">MOVIMIENTO DE CAJA</span>
                      <h2 id="cash-movement-title">
                        {movimientoCajaForm.tipo === 'entrada'
                          ? 'Registrar entrada'
                          : 'Registrar salida'}
                      </h2>
                      <p>
                        {movimientoCajaForm.tipo === 'entrada'
                          ? 'Agrega efectivo que ingresa a la caja fuera de una venta.'
                          : 'Registra efectivo que sale físicamente de la caja.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="cash-movement-close"
                      onClick={cerrarMovimientoCaja}
                      disabled={guardandoMovimientoCaja}
                      aria-label="Cerrar"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={registrarMovimientoCaja}>
                    <div className="cash-movement-type">
                      <button
                        type="button"
                        className={movimientoCajaForm.tipo === 'entrada' ? 'active entry' : ''}
                        onClick={() => cambiarTipoMovimientoCaja('entrada')}
                        disabled={guardandoMovimientoCaja}
                      >
                        + Entrada
                      </button>

                      <button
                        type="button"
                        className={movimientoCajaForm.tipo === 'salida' ? 'active exit' : ''}
                        onClick={() => cambiarTipoMovimientoCaja('salida')}
                        disabled={guardandoMovimientoCaja}
                      >
                        − Salida
                      </button>
                    </div>

                    <div className="form-group">
                      <label>Categoría</label>
                      <select
                        value={movimientoCajaForm.categoria}
                        onChange={(e) =>
                          setMovimientoCajaForm((actual) => ({
                            ...actual,
                            categoria: e.target.value,
                          }))
                        }
                        disabled={guardandoMovimientoCaja}
                      >
                        {movimientoCajaForm.tipo === 'entrada' ? (
                          <>
                            <option value="ingreso">Ingreso de efectivo</option>
                            <option value="devolucion">Devolución recibida</option>
                            <option value="otro">Otro ingreso</option>
                          </>
                        ) : (
                          <>
                            <option value="gasto">Gasto</option>
                            <option value="compra">Compra / Mercadería</option>
                            <option value="retiro">Retiro de efectivo</option>
                            <option value="devolucion">Devolución a cliente</option>
                            <option value="otro">Otra salida</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Monto</label>
                      <div className="cash-money-input">
                        <span>$</span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={movimientoCajaForm.monto}
                          onChange={(e) =>
                            setMovimientoCajaForm((actual) => ({
                              ...actual,
                              monto: e.target.value,
                            }))
                          }
                          placeholder="Ej: 20000"
                          disabled={guardandoMovimientoCaja}
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Descripción <span>(opcional)</span></label>
                      <input
                        type="text"
                        value={movimientoCajaForm.descripcion}
                        onChange={(e) =>
                          setMovimientoCajaForm((actual) => ({
                            ...actual,
                            descripcion: e.target.value,
                          }))
                        }
                        placeholder={
                          movimientoCajaForm.tipo === 'entrada'
                            ? 'Ej: Efectivo adicional para caja'
                            : 'Ej: Compra de insumos'
                        }
                        maxLength="150"
                        disabled={guardandoMovimientoCaja}
                      />
                    </div>

                    <div className="cash-movement-preview">
                      <span>
                        {movimientoCajaForm.tipo === 'entrada'
                          ? 'El efectivo esperado aumentará en'
                          : 'El efectivo esperado disminuirá en'}
                      </span>
                      <strong className={movimientoCajaForm.tipo}>
                        {movimientoCajaForm.tipo === 'entrada' ? '+' : '−'}$
                        {Number(movimientoCajaForm.monto || 0).toLocaleString('es-CL')}
                      </strong>
                    </div>

                    <div className="cash-movement-actions">
                      <button
                        type="button"
                        className="cash-movement-cancel"
                        onClick={cerrarMovimientoCaja}
                        disabled={guardandoMovimientoCaja}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className={`cash-movement-save ${movimientoCajaForm.tipo}`}
                        disabled={guardandoMovimientoCaja}
                      >
                        {guardandoMovimientoCaja
                          ? 'Registrando...'
                          : movimientoCajaForm.tipo === 'entrada'
                            ? 'Registrar entrada'
                            : 'Registrar salida'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <header className="dashboard-header">
              <div>
                <span className="dashboard-label">CAJA</span>
                <h1>Control de caja</h1>
                <p>Administra la apertura y el estado de la caja de {negocio}.</p>
              </div>

              <div className="business-name">
                <span>Negocio</span>
                <strong>{negocio}</strong>
              </div>
            </header>

            {mensajeCaja && (
              <p className="auth-message cash-message">{mensajeCaja}</p>
            )}

            {cargandoCaja ? (
              <section className="dashboard-panel cash-panel">
                <div className="cash-loading">Consultando estado de caja...</div>
              </section>
            ) : !cajaActual ? (
              <section className="dashboard-panel cash-panel cash-closed-panel">
                <div className="cash-status-badge closed">Caja cerrada</div>

                <div className="cash-empty-state">
                  <div className="cash-main-icon">💰</div>
                  <span className="dashboard-label">INICIO DE JORNADA</span>
                  <h2>Abre la caja para comenzar a vender</h2>
                  <p>
                    Ingresa el efectivo disponible al inicio de la jornada. Las ventas
                    que registres quedarán asociadas automáticamente a esta caja.
                  </p>

                  <form className="cash-open-form" onSubmit={abrirCaja}>
                    <div className="form-group">
                      <label>Monto inicial en efectivo</label>
                      <div className="cash-money-input">
                        <span>$</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={montoInicialCaja}
                          onChange={(e) => setMontoInicialCaja(e.target.value)}
                          placeholder="Ej: 50000"
                          disabled={abriendoCaja}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="cash-open-button"
                      disabled={abriendoCaja}
                    >
                      {abriendoCaja ? 'Abriendo caja...' : 'Abrir caja'}
                    </button>
                  </form>

                  <div className="cash-export-card">
                    <div className="cash-export-icon">📊</div>

                    <div className="cash-export-copy">
                      <strong>Historial de cierres</strong>
                      <span>
                        Descarga todos los cierres de caja registrados en Excel.
                      </span>
                    </div>

                    <button
                      type="button"
                      className="cash-export-button"
                      onClick={exportarCierresCajaExcel}
                    >
                      Exportar Excel
                    </button>
                  </div>
                </div>
              </section>
            ) : (
              <>
                <section className="dashboard-stats cash-stats">
                  <article className="stat-card">
                    <div className="stat-top">
                      <span>Estado</span>
                      <div className="stat-icon">●</div>
                    </div>
                    <strong className="stat-value cash-open-text">Abierta</strong>
                    <span className="stat-detail">Caja operativa</span>
                  </article>

                  <article className="stat-card">
                    <div className="stat-top">
                      <span>Monto inicial</span>
                      <div className="stat-icon">$</div>
                    </div>
                    <strong className="stat-value">
                      ${Number(cajaActual.monto_inicial || 0).toLocaleString('es-CL')}
                    </strong>
                    <span className="stat-detail">Efectivo al abrir</span>
                  </article>

                  <article className="stat-card">
                    <div className="stat-top">
                      <span>Apertura</span>
                      <div className="stat-icon">◷</div>
                    </div>
                    <strong className="cash-date-value">
                      {formatearFechaCaja(cajaActual.abierta_en)}
                    </strong>
                    <span className="stat-detail">Inicio de la caja actual</span>
                  </article>
                </section>

                <section className="dashboard-panel cash-panel">
                  <div className="panel-heading cash-heading">
                    <div>
                      <h2>Resumen de la caja actual</h2>
                      <p>Ventas acumuladas desde la apertura de esta caja.</p>
                    </div>
                    <div className="cash-heading-actions">
                      <button
                        type="button"
                        className="cash-entry-button"
                        onClick={() => abrirMovimientoCaja('entrada')}
                      >
                        + Entrada
                      </button>
                      <button
                        type="button"
                        className="cash-exit-button"
                        onClick={() => abrirMovimientoCaja('salida')}
                      >
                        − Salida
                      </button>
                      <span className="cash-status-badge open">Caja abierta</span>
                    
                  <button
                    type="button"
                    className="cash-close-button"
                    onClick={abrirCierreCaja}
                  >
                    Cerrar caja
                  </button>
</div>
                  </div>

                  {cargandoResumenCaja ? (
                    <div className="cash-summary-loading">
                      Actualizando resumen de caja...
                    </div>
                  ) : (
                    <>
                      <div className="cash-summary-highlight">
                        <div>
                          <span>Total vendido</span>
                          <strong>
                            ${Number(resumenCaja?.total_ventas || 0).toLocaleString('es-CL')}
                          </strong>
                          <small>
                            {Number(resumenCaja?.cantidad_ventas || 0)}{' '}
                            {Number(resumenCaja?.cantidad_ventas || 0) === 1
                              ? 'venta completada'
                              : 'ventas completadas'}
                          </small>
                        </div>

                        <div className="cash-expected-card">
                          <span>Efectivo esperado</span>
                          <strong>
                            ${Number(resumenCaja?.efectivo_esperado ?? cajaActual.monto_inicial ?? 0).toLocaleString('es-CL')}
                          </strong>
                          <small>Inicial + efectivo + entradas − salidas</small>
                        </div>
                      </div>

                      <div className="cash-payment-grid">
                        <article><span>Efectivo</span><strong>${Number(resumenCaja?.total_efectivo || 0).toLocaleString('es-CL')}</strong></article>
                        <article><span>Débito</span><strong>${Number(resumenCaja?.total_debito || 0).toLocaleString('es-CL')}</strong></article>
                        <article><span>Crédito</span><strong>${Number(resumenCaja?.total_credito || 0).toLocaleString('es-CL')}</strong></article>
                        <article><span>Transferencia</span><strong>${Number(resumenCaja?.total_transferencia || 0).toLocaleString('es-CL')}</strong></article>
                        <article><span>Otros</span><strong>${Number(resumenCaja?.total_otro || 0).toLocaleString('es-CL')}</strong></article>
                      </div>

                      <div className="cash-movement-summary">
                        <article className="cash-movement-summary-card entry">
                          <span>Otras entradas</span>
                          <strong>
                            +${Number(resumenCaja?.total_entradas || 0).toLocaleString('es-CL')}
                          </strong>
                        </article>

                        <article className="cash-movement-summary-card exit">
                          <span>Salidas de efectivo</span>
                          <strong>
                            −${Number(resumenCaja?.total_salidas || 0).toLocaleString('es-CL')}
                          </strong>
                        </article>
                      </div>

                      <div className="cash-current-info">
                        <div>
                          <span>Monto inicial</span>
                          <strong>${Number(resumenCaja?.monto_inicial ?? cajaActual.monto_inicial ?? 0).toLocaleString('es-CL')}</strong>
                        </div>
                        <div>
                          <span>Abierta desde</span>
                          <strong>{formatearFechaCaja(resumenCaja?.abierta_en ?? cajaActual.abierta_en)}</strong>
                        </div>
                      </div>

                      <div className="cash-next-note">
                        <strong>✓ Resumen actualizado</strong>
                        <span>
                          El efectivo esperado considera el monto inicial, las ventas pagadas en efectivo,
                          las entradas adicionales y las salidas de efectivo. Débito, crédito y transferencia
                          forman parte del total vendido, pero no del efectivo físico.
                        </span>
                      </div>

                      <div className="cash-history">
                        <div className="cash-history-heading">
                          <div>
                            <h3>Movimientos de efectivo</h3>
                            <p>Entradas y salidas registradas durante la caja actual.</p>
                          </div>
                          <span>{movimientosCaja.length} movimiento{movimientosCaja.length === 1 ? '' : 's'}</span>
                        </div>

                        {cargandoMovimientosCaja ? (
                          <div className="cash-history-empty">Cargando movimientos...</div>
                        ) : movimientosCaja.length === 0 ? (
                          <div className="cash-history-empty">
                            Aún no hay entradas o salidas adicionales registradas.
                          </div>
                        ) : (
                          <div className="cash-history-list">
                            {movimientosCaja.map((movimiento) => (
                              <div className="cash-history-row" key={movimiento.id}>
                                <div className={`cash-history-icon ${movimiento.tipo}`}>
                                  {movimiento.tipo === 'entrada' ? '↑' : '↓'}
                                </div>

                                <div className="cash-history-info">
                                  <div>
                                    <strong>{movimiento.descripcion || (movimiento.tipo === 'entrada' ? 'Entrada de efectivo' : 'Salida de efectivo')}</strong>
                                    <span className={`cash-history-type ${movimiento.tipo}`}>
                                      {movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'} · {movimiento.categoria || 'otro'}
                                    </span>
                                  </div>
                                  <small>{formatearFechaCaja(movimiento.creado_en)}</small>
                                </div>

                                <strong className={`cash-history-amount ${movimiento.tipo}`}>
                                  {movimiento.tipo === 'entrada' ? '+' : '−'}$
                                  {Number(movimiento.monto || 0).toLocaleString('es-CL')}
                                </strong>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </section>
              </>
            )}
          </>
        )}

        {/* ========================= */}
        {/* CLIENTES */}
        {/* ========================= */}

        {seccion === 'clientes' && (
          <>
            <header className="dashboard-header">
              <div>
                <span className="dashboard-label">CLIENTES</span>
                <h1>Clientes</h1>
                <p>Administra los clientes de {negocio} desde un solo lugar.</p>
              </div>

              <div className="business-name">
                <span>Negocio</span>
                <strong>{negocio}</strong>
              </div>
            </header>

            <section className="dashboard-stats clients-stats">
              <article className="stat-card">
                <div className="stat-top">
                  <span>Clientes registrados</span>
                  <div className="stat-icon">♙</div>
                </div>
                <strong className="stat-value">{clientes.length}</strong>
                <span className="stat-detail">Clientes activos</span>
              </article>
            </section>

            <section className="dashboard-panel clients-panel">
              <div className="panel-heading clients-heading">
                <div className="clients-heading-info">
                  <h2>Directorio de clientes</h2>
                  <p>Consulta, registra y actualiza la información de tus clientes.</p>
                </div>

                <div className="clients-search">
                  <input
                    type="search"
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                    placeholder="Buscar por nombre, RUT, teléfono o correo..."
                  />
                </div>

                <button type="button" onClick={abrirNuevoCliente}>
                  + Nuevo cliente
                </button>
              </div>

              {mensajeCliente && (
                <p className="auth-message clients-message">{mensajeCliente}</p>
              )}

              {clientes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">♙</div>
                  <strong>Aún no hay clientes</strong>
                  <span>Registra tu primer cliente para comenzar.</span>
                </div>
              ) : clientesFiltrados.length === 0 ? (
                <div className="empty-state">
                  <strong>No encontramos clientes</strong>
                  <span>Prueba con otro nombre, RUT, teléfono o correo.</span>
                </div>
              ) : (
                <div className="products-table-wrap">
                  <table className="products-table clients-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>RUT</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {clientesFiltrados.map((cliente) => (
                        <tr key={cliente.id}>
                          <td>
                            <strong>{cliente.nombre}</strong>
                          </td>
                          <td>{cliente.rut || '—'}</td>
                          <td>{cliente.telefono || '—'}</td>
                          <td>{cliente.correo || '—'}</td>
                          <td>
                            <div className="client-row-actions">
                            <button
                              type="button"
                              className="client-edit-button"
                              onClick={() => abrirEditarCliente(cliente)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="client-delete-button"
                              onClick={() => solicitarEliminarCliente(cliente)}
                            >
                              Eliminar
                            </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {mostrarFormularioCliente && (
              <div className="sale-modal-backdrop" onClick={cerrarFormularioCliente}>
                <div
                  className="client-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sale-detail-header">
                    <div>
                      <span className="dashboard-label">
                        {clienteEditando ? 'EDITAR CLIENTE' : 'NUEVO CLIENTE'}
                      </span>
                      <h2>
                        {clienteEditando
                          ? 'Actualizar cliente'
                          : 'Registrar cliente'}
                      </h2>
                      <p>
                        {clienteEditando
                          ? 'Modifica la información guardada del cliente.'
                          : 'Agrega los datos principales del cliente.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="stock-modal-close"
                      onClick={cerrarFormularioCliente}
                      disabled={guardandoCliente}
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={guardarCliente} className="client-form">
                    <div className="client-form-grid">
                      <div className="form-group">
                        <label>Nombre *</label>
                        <input
                          type="text"
                          value={clienteForm.nombre}
                          onChange={(e) =>
                            setClienteForm({
                              ...clienteForm,
                              nombre: e.target.value,
                            })
                          }
                          placeholder="Ej: Juan Pérez"
                          autoFocus
                        />
                      </div>

                      <div className="form-group">
                        <label>RUT *</label>
                        <input
                          type="text"
                          inputMode="text"
                          value={rutClienteEnFoco ? clienteForm.rut : formatearRutCompleto(clienteForm.rut)}
                          onFocus={() => setRutClienteEnFoco(true)}
                          onBlur={() => setRutClienteEnFoco(false)}
                          onChange={(e) => cambiarRutCliente(e.target.value)}
                          placeholder="Ej: 12345678"
                          maxLength="9"
                          required
                        />
                        <span className="client-field-hint">
                          {clienteForm.rut
                            ? `Se guardará como ${formatearRutCompleto(clienteForm.rut)}`
                            : 'Ingresa el RUT completo, incluyendo el dígito verificador.'}
                        </span>
                      </div>

                      <div className="form-group">
                        <label>Teléfono *</label>
                        <div className="client-phone-input">
                          <span className="client-phone-prefix">🇨🇱 +56</span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={formatearTelefonoChile(clienteForm.telefono)}
                            onChange={(e) => cambiarTelefonoCliente(e.target.value)}
                            placeholder="9 1234 5678"
                            required
                          />
                        </div>
                        <span className="client-field-hint">
                          Número móvil de Chile · 9 dígitos
                        </span>
                      </div>

                      <div className="form-group">
                        <label>Correo *</label>
                        <input
                          type="email"
                          value={clienteForm.correo}
                          onChange={(e) =>
                            setClienteForm({
                              ...clienteForm,
                              correo: e.target.value,
                            })
                          }
                          placeholder="Ej: cliente@correo.cl"
                          required
                        />
                      </div>

                    </div>

                    <div className="client-form-actions">
                      {clienteEditando && (
                        <button
                          type="button"
                          className="client-delete-modal-button"
                          onClick={() => solicitarEliminarCliente(clienteEditando)}
                          disabled={guardandoCliente}
                        >
                          Eliminar cliente
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={cerrarFormularioCliente}
                        disabled={guardandoCliente}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="login-button"
                        disabled={guardandoCliente}
                      >
                        {guardandoCliente
                          ? 'Guardando...'
                          : clienteEditando
                            ? 'Guardar cambios'
                            : 'Registrar cliente'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {clientePorEliminar && (
              <div
                className="sale-modal-backdrop"
                onClick={cerrarEliminarCliente}
              >
                <div
                  className="client-delete-confirm-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="stock-modal-close client-delete-close"
                    onClick={cerrarEliminarCliente}
                    disabled={eliminandoCliente}
                  >
                    ×
                  </button>

                  <div className="client-delete-icon">♙</div>

                  <span className="dashboard-label">NOREVIK</span>
                  <h2>¿Eliminar cliente?</h2>

                  <p>
                    El cliente dejará de aparecer en el listado, pero su registro
                    se conservará para mantener el historial asociado.
                  </p>

                  <div className="client-delete-info">
                    <strong>{clientePorEliminar.nombre}</strong>
                    <span>RUT: {clientePorEliminar.rut || '—'}</span>
                    <span>{clientePorEliminar.correo || '—'}</span>
                    <span>{clientePorEliminar.telefono || '—'}</span>
                  </div>

                  <div className="norevik-confirm-actions">
                    <button
                      type="button"
                      className="norevik-confirm-cancel"
                      onClick={cerrarEliminarCliente}
                      disabled={eliminandoCliente}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="norevik-confirm-danger"
                      onClick={eliminarCliente}
                      disabled={eliminandoCliente}
                    >
                      {eliminandoCliente ? 'Eliminando...' : 'Eliminar cliente'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================= */}
        {/* PROVEEDORES */}
        {/* ========================= */}

        {seccion === 'proveedores' && (
          <>
            <header className="dashboard-header">
              <div>
                <span className="dashboard-label">PROVEEDORES</span>
                <h1>Proveedores</h1>
                <p>Administra los proveedores de {negocio} desde un solo lugar.</p>
              </div>

              <div className="business-name">
                <span>Negocio</span>
                <strong>{negocio}</strong>
              </div>
            </header>

            <section className="dashboard-stats clients-stats">
              <article className="stat-card">
                <div className="stat-top">
                  <span>Proveedores registrados</span>
                  <div className="stat-icon">🚚</div>
                </div>
                <strong className="stat-value">{proveedores.length}</strong>
                <span className="stat-detail">Proveedores activos</span>
              </article>
            </section>

            <section className="dashboard-panel clients-panel">
              <div className="panel-heading clients-heading">
                <div className="clients-heading-info">
                  <h2>Directorio de proveedores</h2>
                  <p>Consulta, registra y actualiza la información de tus proveedores.</p>
                </div>

                <div className="clients-search">
                  <input
                    type="search"
                    value={busquedaProveedor}
                    onChange={(e) => setBusquedaProveedor(e.target.value)}
                    placeholder="Buscar por nombre, RUT, contacto o correo..."
                  />
                </div>

                <button type="button" onClick={abrirNuevoProveedor}>
                  + Nuevo proveedor
                </button>
              </div>

              {mensajeProveedor && (
                <p className="auth-message clients-message">{mensajeProveedor}</p>
              )}

              {proveedores.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🚚</div>
                  <strong>Aún no hay proveedores</strong>
                  <span>Registra tu primer proveedor para comenzar.</span>
                </div>
              ) : proveedoresFiltrados.length === 0 ? (
                <div className="empty-state">
                  <strong>No encontramos proveedores</strong>
                  <span>Prueba con otro nombre, RUT, contacto o correo.</span>
                </div>
              ) : (
                <div className="products-table-wrap">
                  <table className="products-table clients-table">
                    <thead>
                      <tr>
                        <th>Proveedor</th>
                        <th>RUT</th>
                        <th>Contacto</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {proveedoresFiltrados.map((proveedor) => (
                        <tr key={proveedor.id}>
                          <td><strong>{proveedor.nombre}</strong></td>
                          <td>{proveedor.rut || '—'}</td>
                          <td>{proveedor.contacto || '—'}</td>
                          <td>{proveedor.telefono || '—'}</td>
                          <td>{proveedor.correo || '—'}</td>
                          <td>
                            <div className="client-row-actions">
                              <button
                                type="button"
                                className="client-edit-button"
                                onClick={() => abrirEditarProveedor(proveedor)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="client-delete-button"
                                onClick={() => solicitarEliminarProveedor(proveedor)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {mostrarFormularioProveedor && (
              <div className="sale-modal-backdrop" onClick={cerrarFormularioProveedor}>
                <div className="client-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="sale-detail-header">
                    <div>
                      <span className="dashboard-label">
                        {proveedorEditando ? 'EDITAR PROVEEDOR' : 'NUEVO PROVEEDOR'}
                      </span>
                      <h2>
                        {proveedorEditando ? 'Actualizar proveedor' : 'Registrar proveedor'}
                      </h2>
                      <p>
                        {proveedorEditando
                          ? 'Modifica la información guardada del proveedor.'
                          : 'Agrega los datos principales del proveedor.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="stock-modal-close"
                      onClick={cerrarFormularioProveedor}
                      disabled={guardandoProveedor}
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={guardarProveedor} className="client-form">
                    <div className="client-form-grid">
                      <div className="form-group">
                        <label>Nombre / Razón social *</label>
                        <input
                          type="text"
                          value={proveedorForm.nombre}
                          onChange={(e) =>
                            setProveedorForm({ ...proveedorForm, nombre: e.target.value })
                          }
                          placeholder="Ej: Distribuidora Central SpA"
                          autoFocus
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>RUT *</label>
                        <input
                          type="text"
                          inputMode="text"
                          value={rutProveedorEnFoco ? proveedorForm.rut : formatearRutCompleto(proveedorForm.rut)}
                          onFocus={() => setRutProveedorEnFoco(true)}
                          onBlur={() => setRutProveedorEnFoco(false)}
                          onChange={(e) => cambiarRutProveedor(e.target.value)}
                          placeholder="Ej: 76123456"
                          maxLength="9"
                          required
                        />
                        <span className="client-field-hint">
                          {proveedorForm.rut
                            ? `Se guardará como ${formatearRutCompleto(proveedorForm.rut)}`
                            : 'Ingresa el RUT completo, incluyendo el dígito verificador.'}
                        </span>
                      </div>

                      <div className="form-group">
                        <label>Nombre de contacto</label>
                        <input
                          type="text"
                          value={proveedorForm.contacto}
                          onChange={(e) =>
                            setProveedorForm({ ...proveedorForm, contacto: e.target.value })
                          }
                          placeholder="Ej: María González"
                        />
                      </div>

                      <div className="form-group">
                        <label>Teléfono</label>
                        <div className="client-phone-input">
                          <span className="client-phone-prefix">🇨🇱 +56</span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={formatearTelefonoChile(proveedorForm.telefono)}
                            onChange={(e) => cambiarTelefonoProveedor(e.target.value)}
                            placeholder="9 1234 5678"
                          />
                        </div>
                        <span className="client-field-hint">
                          Número móvil de Chile · 9 dígitos
                        </span>
                      </div>

                      <div className="form-group">
                        <label>Correo</label>
                        <input
                          type="email"
                          value={proveedorForm.correo}
                          onChange={(e) =>
                            setProveedorForm({ ...proveedorForm, correo: e.target.value })
                          }
                          placeholder="Ej: ventas@proveedor.cl"
                        />
                      </div>
                    </div>

                    <div className="client-form-actions">
                      {proveedorEditando && (
                        <button
                          type="button"
                          className="client-delete-modal-button"
                          onClick={() => solicitarEliminarProveedor(proveedorEditando)}
                          disabled={guardandoProveedor}
                        >
                          Eliminar proveedor
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={cerrarFormularioProveedor}
                        disabled={guardandoProveedor}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="login-button"
                        disabled={guardandoProveedor}
                      >
                        {guardandoProveedor
                          ? 'Guardando...'
                          : proveedorEditando
                            ? 'Guardar cambios'
                            : 'Registrar proveedor'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {proveedorPorEliminar && (
              <div className="sale-modal-backdrop" onClick={cerrarEliminarProveedor}>
                <div
                  className="client-delete-confirm-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="stock-modal-close client-delete-close"
                    onClick={cerrarEliminarProveedor}
                    disabled={eliminandoProveedor}
                  >
                    ×
                  </button>

                  <div className="client-delete-icon">🚚</div>
                  <span className="dashboard-label">NOREVIK</span>
                  <h2>¿Eliminar proveedor?</h2>

                  <p>
                    El proveedor dejará de aparecer en el listado, pero su registro
                    se conservará para mantener el historial asociado.
                  </p>

                  <div className="client-delete-info">
                    <strong>{proveedorPorEliminar.nombre}</strong>
                    <span>RUT: {proveedorPorEliminar.rut || '—'}</span>
                    <span>{proveedorPorEliminar.contacto || 'Sin contacto'}</span>
                    <span>{proveedorPorEliminar.correo || '—'}</span>
                    <span>{proveedorPorEliminar.telefono || '—'}</span>
                  </div>

                  <div className="norevik-confirm-actions">
                    <button
                      type="button"
                      className="norevik-confirm-cancel"
                      onClick={cerrarEliminarProveedor}
                      disabled={eliminandoProveedor}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="norevik-confirm-danger"
                      onClick={eliminarProveedor}
                      disabled={eliminandoProveedor}
                    >
                      {eliminandoProveedor ? 'Eliminando...' : 'Eliminar proveedor'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}


        {seccion === 'compras' && (
          <section className="clients-section">
            <div className="clients-heading">
              <div>
                <span className="section-kicker">COMPRAS</span>
                <h2>Compras a proveedores</h2>
                <p>Registra mercadería comprada y actualiza el inventario automáticamente.</p>
              </div>
            </div>

            {mensajeCompra && (
              <div className="product-message">{mensajeCompra}</div>
            )}

            <div className="clients-panel">
              <form onSubmit={registrarCompra} className="client-form">
                <div className="client-form-grid">
                  <label>
                    Proveedor *
                    <select
                      value={proveedorCompraId}
                      onChange={(e) => setProveedorCompraId(e.target.value)}
                      required
                    >
                      <option value="">Seleccionar proveedor</option>
                      {proveedores.map((proveedor) => (
                        <option key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre} · {proveedor.rut}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Método de pago *
                    <select
                      value={metodoPagoCompra}
                      onChange={(e) => setMetodoPagoCompra(e.target.value)}
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="debito">Débito</option>
                      <option value="credito">Crédito</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="otro">Otro</option>
                    </select>
                  </label>

                  <label>
                    Documento / Folio
                    <input
                      type="text"
                      value={numeroDocumentoCompra}
                      onChange={(e) => setNumeroDocumentoCompra(e.target.value)}
                      placeholder="Ej: Factura 1548"
                    />
                  </label>

                  <label>
                    Observaciones
                    <input
                      type="text"
                      value={observacionesCompra}
                      onChange={(e) => setObservacionesCompra(e.target.value)}
                      placeholder="Opcional"
                    />
                  </label>
                </div>

                <div className="clients-heading" style={{ marginTop: 20 }}>
                  <div>
                    <strong>Agregar productos</strong>
                    <p>Busca un producto existente y agrégalo a la compra.</p>
                  </div>
                </div>

                <input
                  className="clients-search"
                  type="search"
                  value={busquedaCompra}
                  onChange={(e) => setBusquedaCompra(e.target.value)}
                  placeholder="Buscar por producto, SKU o categoría..."
                />

                <div className="inventory-table-wrap" style={{ marginTop: 12 }}>
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>SKU</th>
                        <th>Stock actual</th>
                        <th>Costo actual</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosCompraFiltrados.slice(0, 12).map((producto) => (
                        <tr key={producto.id}>
                          <td>{producto.nombre}</td>
                          <td>{producto.sku || '—'}</td>
                          <td>{producto.stock}</td>
                          <td>${Number(producto.costo || 0).toLocaleString('es-CL')}</td>
                          <td>
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => agregarProductoCompra(producto)}
                              disabled={carritoCompra.some((item) => item.id === producto.id)}
                            >
                              {carritoCompra.some((item) => item.id === producto.id)
                                ? 'Agregado'
                                : '+ Agregar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="inventory-table-wrap" style={{ marginTop: 24 }}>
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Costo unitario</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {carritoCompra.length === 0 ? (
                        <tr>
                          <td colSpan="5">Aún no has agregado productos.</td>
                        </tr>
                      ) : (
                        carritoCompra.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <strong>{item.nombre}</strong>
                              <div>{item.sku || 'Sin SKU'}</div>
                            </td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={item.cantidadCompra}
                                onChange={(e) =>
                                  cambiarCantidadCompra(item.id, e.target.value)
                                }
                                style={{ width: 90 }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.costoCompra}
                                onChange={(e) =>
                                  cambiarCostoCompra(item.id, e.target.value)
                                }
                                style={{ width: 130 }}
                              />
                            </td>
                            <td>
                              ${(
                                Number(item.cantidadCompra || 0) *
                                Number(item.costoCompra || 0)
                              ).toLocaleString('es-CL')}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="client-delete-button"
                                onClick={() => quitarProductoCompra(item.id)}
                              >
                                Quitar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    marginTop: 22,
                  }}
                >
                  <div>
                    <span>Total compra</span>
                    <h3 style={{ margin: '4px 0 0' }}>
                      ${Number(totalCompra || 0).toLocaleString('es-CL')}
                    </h3>
                  </div>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={guardandoCompra || carritoCompra.length === 0}
                  >
                    {guardandoCompra ? 'Registrando...' : 'Registrar compra'}
                  </button>
                </div>
              </form>
            </div>

            <div className="clients-panel" style={{ marginTop: 24 }}>
              <div className="clients-heading">
                <div>
                  <strong>Últimas compras</strong>
                  <p>Historial reciente de compras registradas.</p>
                </div>
              </div>

              <div className="inventory-table-wrap">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Proveedor</th>
                      <th>Documento</th>
                      <th>Método</th>
                      <th>Productos</th>
                      <th>Estado</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compras.length === 0 ? (
                      <tr>
                        <td colSpan="8">Aún no hay compras registradas.</td>
                      </tr>
                    ) : (
                      compras.map((compra) => (
                        <tr key={compra.id}>
                          <td>{formatearFechaVenta(compra.creado_en)}</td>
                          <td>{compra.proveedores?.nombre || '—'}</td>
                          <td>{compra.numero_documento || '—'}</td>
                          <td className="capitalize">{compra.metodo_pago}</td>
                          <td>{compra.detalle_compras?.length || 0}</td>
                          <td>
                            <span className={`sale-status ${compra.estado}`}>
                              {compra.estado === 'completada' ? 'Completada' : 'Anulada'}
                            </span>
                          </td>
                          <td>
                            <strong>
                              ${Number(compra.total || 0).toLocaleString('es-CL')}
                            </strong>
                          </td>
                          <td>
                            <div className="sale-row-actions">
                              <button
                                type="button"
                                className="sale-detail-button"
                                onClick={() => abrirDetalleCompra(compra)}
                              >
                                Ver detalle
                              </button>
                              {compra.estado !== 'anulada' && (
                                <button
                                  type="button"
                                  className="sale-cancel-button"
                                  onClick={() => solicitarAnulacionCompra(compra)}
                                  disabled={anulandoCompra}
                                >
                                  Anular
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {compraDetalle && (
              <div className="sale-modal-backdrop" onClick={cerrarDetalleCompra}>
                <div
                  className="sale-detail-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sale-detail-header">
                    <div>
                      <span className="dashboard-label">DETALLE DE COMPRA</span>
                      <h2>Compra registrada</h2>
                      <p>{formatearFechaVenta(compraDetalle.creado_en)}</p>
                    </div>

                    <button
                      type="button"
                      className="stock-modal-close"
                      onClick={cerrarDetalleCompra}
                      disabled={anulandoCompra}
                    >
                      ×
                    </button>
                  </div>

                  <div className="sale-detail-summary">
                    <div>
                      <span>Proveedor</span>
                      <strong>{compraDetalle.proveedores?.nombre || '—'}</strong>
                      {compraDetalle.proveedores?.rut && (
                        <small>{compraDetalle.proveedores.rut}</small>
                      )}
                    </div>
                    <div>
                      <span>Documento</span>
                      <strong>{compraDetalle.numero_documento || 'Sin documento'}</strong>
                    </div>
                    <div>
                      <span>Método de pago</span>
                      <strong className="capitalize">{compraDetalle.metodo_pago}</strong>
                    </div>
                    <div>
                      <span>Estado</span>
                      <span className={`sale-status ${compraDetalle.estado}`}>
                        {compraDetalle.estado === 'completada' ? 'Completada' : 'Anulada'}
                      </span>
                    </div>
                  </div>

                  {compraDetalle.observaciones && (
                    <div className="norevik-confirm-info" style={{ marginBottom: 18 }}>
                      <strong>Observaciones:</strong> {compraDetalle.observaciones}
                    </div>
                  )}

                  <div className="sale-detail-items">
                    <div className="sale-detail-items-header">
                      <span>Producto</span>
                      <span>Subtotal</span>
                    </div>

                    {(compraDetalle.detalle_compras || []).map((detalle) => (
                      <div className="sale-detail-item" key={detalle.id}>
                        <div>
                          <strong>{detalle.productos?.nombre || 'Producto'}</strong>
                          <span>
                            {detalle.cantidad} × ${Number(detalle.costo_unitario || 0).toLocaleString('es-CL')}
                            {detalle.productos?.sku ? ` · ${detalle.productos.sku}` : ''}
                          </span>
                        </div>

                        <strong>
                          ${Number(detalle.subtotal || 0).toLocaleString('es-CL')}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="sale-detail-total">
                    <span>Total de la compra</span>
                    <strong>
                      ${Number(compraDetalle.total || 0).toLocaleString('es-CL')}
                    </strong>
                  </div>

                  <div className="sale-detail-actions">
                    <button
                      type="button"
                      onClick={cerrarDetalleCompra}
                      disabled={anulandoCompra}
                    >
                      Cerrar
                    </button>

                    {compraDetalle.estado !== 'anulada' && (
                      <button
                        type="button"
                        className="sale-cancel-confirm"
                        onClick={() => solicitarAnulacionCompra(compraDetalle)}
                        disabled={anulandoCompra}
                      >
                        {anulandoCompra ? 'Anulando...' : 'Anular compra'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {compraPorAnular && (
              <div
                className="sale-modal-backdrop"
                onClick={cerrarConfirmacionAnulacionCompra}
              >
                <div
                  className="norevik-confirm-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="norevik-confirm-icon">!</div>

                  <span className="dashboard-label">NOREVIK</span>
                  <h2>Anular compra</h2>

                  <p>
                    ¿Deseas anular esta compra por{' '}
                    <strong>
                      ${Number(compraPorAnular.total || 0).toLocaleString('es-CL')}
                    </strong>
                    ?
                  </p>

                  <div className="norevik-confirm-info">
                    Las unidades de esta compra serán descontadas del inventario y la
                    compra quedará marcada como anulada. Si ya no existe stock suficiente,
                    NOREVIK impedirá la anulación.
                  </div>

                  <div className="norevik-confirm-actions">
                    <button
                      type="button"
                      className="norevik-confirm-cancel"
                      onClick={cerrarConfirmacionAnulacionCompra}
                      disabled={anulandoCompra}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="norevik-confirm-danger"
                      onClick={anularCompra}
                      disabled={anulandoCompra}
                    >
                      {anulandoCompra ? 'Anulando...' : 'Anular compra'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
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
    <span>Lo que puedes gestionar</span>
    <span>● Gestión en tiempo real</span>
  </div>

  <div className="preview-stats">

    <div>
      <span>Ventas</span>
      <strong>Control de ventas</strong>
    </div>

    <div>
      <span>Ingresos</span>
      <strong>Control de ingresos</strong>
    </div>

  </div>

  <div className="preview-stock">

    <div>
      <span>Inventario</span>
      <strong>Stock actualizado</strong>
    </div>

    <span className="stock-alert">
      Alertas de stock
    </span>

  </div>

</div>

        </div>

      </div>

    </div>
  )
}

export default App