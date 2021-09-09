var app1 = new Vue({
    el: "#app1",
    data: {
        name: "Yann",
        age: 23,
        free: true,
        holiday: "partir en vacance"
    },
    methods: {
        FctHoliday: function () {
            if (this.free == true) {
                this.free = false
                this.holiday = "revenir de vacance"
            }
            else {
                this.free = true
                this.holiday = "partir en vacance"
            }
        }
    }
});

var app2 = new Vue({
    el: "#app2",
    data: {
        NewElement: "",
        items: [
            { name: "ceci" },
            { name: "est" },
            { name: "une" },
            { name: "liste" }
        ]
    },
    methods: {
        onSubmit: function () {
            app2.items.push({ name: this.NewElement })
        }
    }
})

var app3 = new Vue({
    el: "#app3",
    data: {
        R: "",
        G: "",
        B: "",
    },
    computed: {
        rgb: function () {
            return `rgb(${this.R}, ${this.G}, ${this.B})`
        }
    }
})

var app4 = new Vue({
    el: "#app4",
    data: {
        cm: "",
        inch: ""
    },
    watch: {
        cm: function (val) {
            this.cm = val;
            this.inch = Math.round((val / 2.54) * 10000) / 10000;
        },
        inch: function (val) {
            this.inch = val;
            this.cm = Math.round((val * 2.54) * 10000) / 10000;
        }
    }
})