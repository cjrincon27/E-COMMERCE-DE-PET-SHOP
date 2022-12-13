const app = Vue.createApp({
    data() {
        return {
            url: 'https://apipetshop.herokuapp.com/api/articulos',
            arrayCompleto: [],
            arrayCompletoBackup: [],
            carrito: [],
            juguetes: [],
            maximo: 0,
            minimo: 0,
            total: 0,
            totalNeto: 0,
            medicamentos: [],
            backJuguetes: [],
            backMedicamentos: [],
            arrayCarrousel: [],
            backupArrayCarrousel: [],
            menosStock1: [],
            menosStock2: [],
            menosStock3: [],
            palabraBuscada: "",
            ordenar: "0",
            identificador: (new URLSearchParams(location.search)).get("id"),
            detalles: "",
        }
    },

    created() {
        this.loadData(this.url)
    },
    mounted() {
        let almacenamiento = JSON.parse(localStorage.getItem('items'))
        if (almacenamiento) {
            this.carrito = almacenamiento
        }
    },
    methods: {
        loadData(url) {
            fetch(url).then(res => res.json()
                .then(data => {
                    this.arrayCompleto = data.response
                    this.juguetes = this.arrayCompleto.filter(item => item.tipo.includes("Juguete"))
                    this.medicamentos = this.arrayCompleto.filter(item => item.tipo.includes("Medicamento"))
                    this.arrayCompletoBackup = this.arrayCompleto
                    this.backJuguetes = this.juguetes
                    this.backMedicamentos = this.medicamentos
                    this.arrayCarrousel = this.arrayCompleto.sort((a, b) => a.stock - b.stock)
                    this.menosStock1 = [this.arrayCarrousel[0]]
                    this.menosStock2 = [this.arrayCarrousel[1]]
                    this.menosStock3 = [this.arrayCarrousel[2]]
                    this.detalles = this.arrayCompleto.find(item => item._id == this.identificador)                    
                    this.totalNeto = this.carrito.map(item => item.precio).reduce((acumulador, item) => acumulador + item, 0)
                    this.calculo()
                })
            )
            .catch(error => console.error(error.message));
        },
        agregarCarrito(producto) {
            if (!this.carrito.includes(producto)) {
                this.carrito.push(producto)
                localStorage.setItem('items', JSON.stringify(this.carrito))
                Swal.fire(
                    '¡Se ha agregado el producto al carrito!',
                    'Ya podés ir al carrito para revisar tus productos agregados',
                )
            }
        },
        eliminarCarrito(producto) {
            Swal.fire({
                title: '¿Estás seguro de eliminar este producto?',
                text: "¡No sera posible revetir este cambio!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, eliminalo!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.carrito = this.carrito.filter(productoE => productoE != producto)
                    localStorage.setItem('items', JSON.stringify(this.carrito))
                    location.reload(true)
                }
            })
        },
        calculo() {
            let iva = 21;
            let tasa = (this.totalNeto * iva) / 100;
            this.total = (this.totalNeto + tasa);
        }
    },
    computed: {
        filtroInputJuguetes() {
            this.juguetes = this.backJuguetes.filter(juguete => juguete.nombre.toLowerCase().includes(this.palabraBuscada.toLowerCase()))
        },
        filtroInputMedicamentos() {
            this.medicamentos = this.backMedicamentos.filter(medicina => medicina.nombre.toLowerCase().includes(this.palabraBuscada.toLowerCase()))
        },
        filtroSortMedicamentos() {
            if (this.ordenar == "1") {
                this.medicamentos = this.backMedicamentos.sort((a, b) => a.stock - b.stock)
            } else if (this.ordenar == "2") {
                this.medicamentos = this.backMedicamentos.sort((a, b) => a.precio - b.precio)
            } else if (this.ordenar == "3") {
                this.medicamentos = this.backMedicamentos.sort((a, b) => b.precio - a.precio)
            }
        },
        filtroSortJuguetes() {
            if (this.ordenar == "1") {
                this.juguetes = this.backJuguetes.sort((a, b) => a.stock - b.stock)
            } else if (this.ordenar == "2") {
                this.juguetes = this.backJuguetes.sort((a, b) => a.precio - b.precio)
            } else if (this.ordenar == "3") {
                this.juguetes = this.backJuguetes.sort((a, b) => b.precio - a.precio)
            }
        }

    },

}).mount('#app')