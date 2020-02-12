const database = firebase.database();
const messageRef = database.ref("sensor");
const messageRef2 = database.ref("allData");

new Vue({
    el:"#webhrv",
    data:{
        age:'',
        values:[],
        times:[],
        values2:[],
        times2:[],
        allTime:[],
        valueECG:'',
        minus:[],
        RR:[],
        sum:'',
        count:'',
        power2:[],
        total:'',
        mean:'',
        maxValue:0,
        maxTime:0,
        arrMax:[],
        countDrop:1,
        test:[1,2,3]
    },
    methods:{
        storeMessage:function(){
            messageRef.push({time:this.time,value:this.valueECG})
            this.time=''
        },
        calculate:function(){
            this.sum = 0
            this.mean = 0
            this.square = 0
            this.count = this.arrMax.length - 1
            // console.log(this.arrMax)
            for (var i=0; i<this.count; i++){
                this.minus[i] = this.arrMax[i+1][1] - this.arrMax[i][1]      //time2-time1       
                // console.log(this.minus)            
            }
            for(var i=0;i<this.count-1;i++){
                this.RR[i] = this.minus[i+1] - this.minus[i]    //RR2-RR1
            }
            for(var i=0;i<this.count-1;i++){
                this.power2[i] = this.RR[i]*this.RR[i]              //(RR2-RR1)^2
            }
            for(var i=0;i<this.count-1;i++){
                // console.log(this.power2)                        
                this.sum += this.power2[i]                          //sum diff RRinterval
            }
                this.mean = this.sum/this.count
                this.total = Math.sqrt(this.mean)                   //square
                this.total = this.total.toFixed(2)                  //fix dot number
            //console.log(this.minus)
        },
        chart:function(){
            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
            type: 'line',
            // The data for our dataset
            
            data: {
                labels:[] = this.times2,
                datasets: [{
                    label: 'ECG values',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    lineTension:'0.3',
                    pointBorderColor:'',
                    borderColor: 'rgb(255, 99, 132)',
                    data:[] = this.values2
                }]
                
            },
            options: {
                    labels: {
                        hidden:true
                    }

            }
        });

        }

        
        
    },
    
    created(){
        // show data from database
        messageRef2.on('child_added',snapshot=>{
            // push data from database to array
            this.values2.push(snapshot.val().value)
            this.times2.push(snapshot.val().time)
            this.chart();
        })
        messageRef.on('child_added' ,snapshot=>{
            // push data from database to array
            this.values.push(snapshot.val().value)
            this.times.push(snapshot.val().time)
            //console.log(snapshot.val().time); 

            if(this.maxValue <  snapshot.val().value){
                this.maxValue = snapshot.val().value;
                this.maxTime = snapshot.val().time;
                // this.countDrop=0;
                // console.log("value Increase")
                this.countDrop=1
            }else{
                // console.log("value Drop")
                this.countDrop--
            }
            if(this.countDrop==0){
                var tempData = [];
                tempData[0] = this.maxValue;
                tempData[1] = this.maxTime;
                this.arrMax.push(tempData)
                this.maxValue = snapshot.val().value;
                this.maxTime = snapshot.val().time;
                this.countDrop--;
                // console.log(this.maxValue)
            }
            this.calculate(); 
            // this.chart();
        }) 
        


        
    }
})