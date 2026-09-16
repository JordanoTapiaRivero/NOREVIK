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

  // CLIENTES
  const [clientes, setClientes] = useState([])
  const [busquedaCliente, setBusquedaCliente] = useState('')
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false)
  const [guardandoCliente, setGuardandoCliente] = useState(false)
  const [mensajeCliente, setMensajeCliente] = useState('')
  const [clienteEditando, setClienteEditando] = useState(null)
  const [clientePorEliminar, setClientePorEliminar] = useState(null)
  const [eliminandoCliente, setEliminandoCliente] = useState(false)
  const [clienteForm, setClienteForm] = useState({
    nombre: '',
    rut: '',
    telefono: '',
    correo: '',
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

  useEffect(() => {
    if (perfil?.negocio_id) {
      cargarCajaActual(perfil.negocio_id)
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

    await cargarCajaActual(perfil.negocio_id)
    setMontoInicialCaja('')
    setMensajeCaja('Caja abierta correctamente.')
    setAbriendoCaja(false)
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

  const calcularDigitoVerificadorRut = (rutNumerico) => {
    if (!rutNumerico) return ''

    let suma = 0
    let multiplicador = 2

    for (let i = rutNumerico.length - 1; i >= 0; i -= 1) {
      suma += Number(rutNumerico[i]) * multiplicador
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
    }

    const resultado = 11 - (suma % 11)

    if (resultado === 11) return '0'
    if (resultado === 10) return 'K'
    return String(resultado)
  }

  const formatearRutAutomatico = (valor) => {
    const cuerpo = String(valor || '').replace(/\D/g, '').slice(0, 8)
    if (!cuerpo) return ''

    const dv = calcularDigitoVerificadorRut(cuerpo)
    const cuerpoFormateado = Number(cuerpo).toLocaleString('es-CL')
    return `${cuerpoFormateado}-${dv}`
  }

  const cambiarRutCliente = (valor) => {
    const soloNumeros = String(valor || '').replace(/\D/g, '').slice(0, 8)
    setClienteForm((actual) => ({ ...actual, rut: soloNumeros }))
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
      rut: (cliente.rut || '').split('-')[0].replace(/\D/g, ''),
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

    const rutNumerico = clienteForm.rut.replace(/\D/g, '')
    const telefonoNumerico = clienteForm.telefono.replace(/\D/g, '')

    if (rutNumerico && rutNumerico.length < 7) {
      setMensajeCliente('Ingresa un RUT válido.')
      return
    }

    if (telefonoNumerico && telefonoNumerico.length !== 9) {
      setMensajeCliente('El teléfono debe tener 9 dígitos después del +56.')
      return
    }

    const datosCliente = {
      negocio_id: perfil.negocio_id,
      nombre: clienteForm.nombre.trim(),
      rut: rutNumerico ? formatearRutAutomatico(rutNumerico) : null,
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

  return (
    <div className="dashboard">

      
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
                      <h2>Caja actual</h2>
                      <p>Las nuevas ventas quedarán vinculadas a esta jornada.</p>
                    </div>
                    <span className="cash-status-badge open">Caja abierta</span>
                  </div>

                  <div className="cash-current-info">
                    <div>
                      <span>Monto inicial</span>
                      <strong>
                        ${Number(cajaActual.monto_inicial || 0).toLocaleString('es-CL')}
                      </strong>
                    </div>
                    <div>
                      <span>Abierta desde</span>
                      <strong>{formatearFechaCaja(cajaActual.abierta_en)}</strong>
                    </div>
                  </div>

                  <div className="cash-next-note">
                    <strong>✓ Caja lista para operar</strong>
                    <span>
                      Ya puedes registrar ventas. En el siguiente paso agregaremos el
                      resumen por método de pago y el cierre de caja.
                    </span>
                  </div>
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
                          inputMode="numeric"
                          value={clienteForm.rut}
                          onChange={(e) => cambiarRutCliente(e.target.value)}
                          placeholder="Ej: 12345678"
                          maxLength="8"
                          required
                        />
                        <span className="client-field-hint">
                          {clienteForm.rut
                            ? `Se guardará como ${formatearRutAutomatico(clienteForm.rut)}`
                            : 'Escribe solo los números. NOREVIK calcula el dígito verificador.'}
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