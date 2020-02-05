const database = firebase.database();
const messageRef = database.ref("sensor");

new Vue({
    el: "#age",
    data: {
        // age:'',
        values: [],
        sum:'',
        ageInput: 0,
        minus:'',
        power2:'',
        total:'',
        square:'',
        count:'',

        
    },
    methods: {
        storeMessage: function () {
            messageRef.push({ time: this.ageInput})
            this.ageInput = ''
        },

        calculate:function(){
            this.minus = 0
            this.sum = 0
            this.power2 = 0
            this.total = 0
            this.square = 0
            this.count = this.values.length - 1
 
            for (var i=0; i< this.count; i++){
                this.minus = this.values[i+1] - this.values[i]      //RR1-RR0
                this.power2 = Math.pow(this.minus,2)                //(RR1-RR0)^2
                this.sum += this.power2                             //summation
            }
                this.square = Math.sqrt(this.sum)                   //square
                this.total = this.square/this.count
                this.total = parseFloat(this.total).toFixed(2);
            //console.log(this.minus)
        },
    },

    created() {
        // show data from database
        messageRef.on('child_added', snapshot => {
            // push data from database to array
            this.values.push(snapshot.val().time)
            // this.sum += snapshot.val().time
            // console.log(this.sum)
            this.calculate();
        })
        // this.calC();
    },

})