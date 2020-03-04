const database = firebase.database();
const messageRef = database.ref("allData");
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
        minus2:[],
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
        dataFilter:[], //all data after filter
        pushValue:'', //check value and push minus
        arrFilter:[], //push all data to arr
        arrTimeFilter:[],
        baseLine:'',
        baseLine2:'',

    },
    methods:{
        storeMessage:function(){
            messageRef.push({time:this.time,value:this.valueECG})
            this.time=''
        },

        filter:function(){
            for (var i=0; i<this.values.length; i++){
                    this.arrFilter[i]=this.values[i]
                    this.arrTimeFilter[i]=this.times[i]
            }
            // console.log(this.arrTimeFilter)

            // cal baseLine for filter data
            this.baseLine=0
            this.baseLine2=0
            for (var i=0; i<this.arrFilter.length; i++){
                        this.baseLine+=this.arrFilter[i]
            }
            this.baseLine2=this.baseLine/this.arrFilter.length
            console.log(this.baseLine2)

            this.pushValue=0
            for (var i=0; i<this.arrFilter.length; i++){
                // if(this.arrFilter[i]>2500){
                if(this.arrFilter[i]-this.baseLine2>200){ // check peak data with base line
                    //check data(value) drop
                    if(this.arrFilter[i]-this.arrFilter[i+2]>600){
                        //check data(value) before&after peak <peak
                        if(this.arrFilter[i]-this.arrFilter[i+1]>0&&this.arrFilter[i]-this.arrFilter[i-1]>0){
                            this.dataFilter[this.pushValue]=this.arrTimeFilter[i]
                            this.pushValue+=1                               
                        }
                         
                    }
                }
            }
        // console.log(this.dataFilter)

        },
        calculate:function(){
            var temp=0;
            this.sum = 0
            this.mean = 0
            this.square = 0
            this.count = this.dataFilter.length - 1

            for (var i=0; i<this.count; i++){
                this.minus2[i] = this.dataFilter[i+1] - this.dataFilter[i]     //time2-time1 
            }
            this.pushValue=0
            for(var i=0; i<this.minus2.length; i++){
                if(this.minus2[i]>100){
                        this.minus[this.pushValue] = this.minus2[i]
                        this.pushValue+=1
                        // console.log(this.minus2[i]+'#'+i)
                    }
            }
            // console.log(this.minus)    
            for(var i=0;i<this.minus.length-1;i++){
                this.RR[i] = this.minus[i+1] - this.minus[i]    //RR2-RR1
            }
            // console.log(this.RR)
            for(var i=0;i<this.minus.length-1;i++){
                this.power2[i] = this.RR[i]*this.RR[i]              //(RR2-RR1)^2
            }
            // console.log(this.power2)
            for(var i=0;i<this.minus.length-1;i++){
                // console.log(this.power2)                        
                this.sum += this.power2[i]                          //sum diff RRinterval
            }

                this.mean = this.sum/this.count
                this.total = Math.sqrt(this.mean)                   //square
                this.total = this.total.toFixed(2)                  //fix dot number
            // console.log(this.sum)
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

    // chart fix 
    //     chart:function(){
    //         var limit = 1000;
    //         var data = [];
    //         var dataSeries = { type: "line" };
    //         var dataPoints = [];
    //         for (var i = 0; i < limit; i++) {
    //             dataPoints.push({
    //                 x: i*10,
    //                 y: this.values2[i]
    //             });
    //         }
    //         dataSeries.dataPoints = dataPoints;
    //         data.push(dataSeries);
        
    //         //Better to construct options first and then pass it as a parameter
    //         var options = {
    //             backgroundColor: 'rgba(0, 0, 0, 0)',
    //             zoomEnabled: true,
    //             animationEnabled: true,
    //             title: {
    //                 text: "Electrocardiogram (ECG)"
    //             },
    //             axisY: {
    //                 includeZero: false,
    //                 lineThickness: 1
    //             },
    //             data: data,
    //             borderColor: 'rgb(255, 99, 132)',
    //         };
        
    //         var chart = new CanvasJS.Chart("chartContainer", options);
    //         //var startTime = new Date();
    //         chart.render();
    //         //var endTime = new Date();
    //         //document.getElementById("timeToRender").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
    // }

    // },

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

            // if(this.maxValue <  snapshot.val().value){
            //     this.maxValue = snapshot.val().value;
            //     this.maxTime = snapshot.val().time;
            //     // this.countDrop=0;
            //     // console.log("value Increase")
            //     this.countDrop=1
            // }else{
            //     // console.log("value Drop")
            //     this.countDrop--
            // }
            // if(this.countDrop==0){
            //     var tempData = [];
            //     tempData[0] = this.maxValue;
            //     tempData[1] = this.maxTime;
            //     this.arrMax.push(tempData)
            //     this.maxValue = snapshot.val().value;
            //     this.maxTime = snapshot.val().time;
            //     this.countDrop--;
            //     // console.log(this.maxValue)
            // }
            this.calculate(); 
            this.filter();
            // this.chart();
            
        }) 
        


        
    }
})