const database = firebase.database();
const messageRef = database.ref("allData");
// const messageRef2 = database.ref("allData");

new Vue({
    el:"#webhrv",
    data:{
//snapshot data
        values:[], 
        times:[],
        values2:[],
        times2:[],
        // allTime:[],
        // valueECG:'',
// calculate
        minus:[], 
        minus2:[],
        RR:[],
        sum:'',
        count:'',
        power2:[],
        total:'0',
        mean:'',
//for check drop
        // maxValue:0, 
        // maxTime:0,
        // arrMax:[],
        // countDrop:1,
// filter function
        dataFilter:[], //all data after filter
        pushValue:'', //check value and push minus
        arrFilter:[], //push all data to arr
        arrTimeFilter:[],
        baseLine:'',
        avgBaseline:'',
        dataFilter2:[],
        pushValue2:'',
// heartBeat function
        diffTime:'',
        heartRate:'0',
//input age&gender
        gender:'',
        inputGender:'',
        age:'',
        inputAge:'',
        goodReport:'Healthy',
        badReport:'Unhealthy',
        messageReport:'age 10-99 y',
        dataReport:'Fill Out Data',
        testError:'Error',
// chartError
        chartError:'',

    },
    methods:{
        storeMessage:function(){
            this.chartError=100
            this.inputAge=this.age
            this.age=''
            this.inputGender=this.gender
            this.gender=''
            // console.log(this.inputGender)
            // console.log(this.inputAge)
            //Female analyze
            if(this.inputGender==1){
                if(this.inputAge<10){
                    this.dataReport=this.messageReport
                    // console.log(this.messageReport)
                }
                else if(this.inputAge>99){
                    this.dataReport=this.messageReport
                    // console.log(this.messageReport)
                }
                //age 70-99
                else if(this.inputAge>=70){
                    if(this.total<14){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else if(this.total>30){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else
                    this.dataReport=this.goodReport
                    // console.log(this.goodReport)
                }
                //age 50-69
                else if(this.inputAge>=50){
                    if(this.total<18){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else if(this.total>32){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else
                    this.dataReport=this.goodReport
                    // console.log(this.goodReport)
                }
                //age 30-49
                else if(this.inputAge>=30){
                    if(this.total<21){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else if(this.total>41){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else
                    this.dataReport=this.goodReport
                    // console.log(this.goodReport)
                }
                //age 10-29
                else if(this.inputAge>=10){
                    if(this.total<25){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else if(this.total>61){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else
                    this.dataReport=this.goodReport
                    // console.log(this.goodReport)
                }
            }

            //Male analyze
            if(this.inputGender==2){
                if(this.inputAge<10){
                    this.dataReport=this.messageReport
                    // console.log(this.messageReport)
                }
                else if(this.inputAge>99){
                    this.dataReport=this.messageReport
                    // console.log(this.messageReport)
                }
                //age 70-99
                else if(this.inputAge>=70){
                    if(this.total<17){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else if(this.total>27){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else
                    this.dataReport=this.goodReport
                    // console.log(this.goodReport)
                }
                //age 50-69
                else if(this.inputAge>=50){
                    if(this.total<14){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else if(this.total>30){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else
                    this.dataReport=this.goodReport
                    // console.log(this.goodReport)
                }
                //age 30-49
                else if(this.inputAge>=30){
                    if(this.total<21){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else if(this.total>47){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else
                    this.dataReport=this.goodReport
                    // console.log(this.goodReport)
                }
                //age 10-29
                else if(this.inputAge>=10){
                    if(this.total<35){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else if(this.total>71){
                        this.dataReport=this.badReport
                        // console.log(this.dataReport)
                    }
                    else
                    this.dataReport=this.goodReport
                    // console.log(this.goodReport)
                }
            }
        },

        filter:function(){
            for (var i=0; i<this.values.length; i++){
                    this.arrFilter[i]=this.values[i]
                    this.arrTimeFilter[i]=this.times[i]
            }
            // console.log(this.arrTimeFilter)

            // calculate(avg data) baseLine for filter data
            this.baseLine=0
            this.avgBaseline=0
            for (var i=0; i<this.arrFilter.length; i++){
                        this.baseLine+=this.arrFilter[i]
            }
            this.avgBaseline=this.baseLine/this.arrFilter.length
            // console.log(this.avgBaseline)

            this.pushValue=0
            this.pushValue2=0
            for (var i=0; i<this.arrFilter.length; i++){
                // if(this.arrFilter[i]>2500){
                if(this.arrFilter[i]-this.avgBaseline>200){ // check peak data with base line
                    //check data(value) drop
                    if(this.arrFilter[i]-this.arrFilter[i+2]>600 && this.arrFilter[i]-this.arrFilter[i-2]>200){
                        //check data(value) before&after peak <peak
                        if(this.arrFilter[i]-this.arrFilter[i+1]>-1 && (this.arrFilter[i]-this.arrFilter[i-1]>-1)){
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
            this.count = this.dataFilter.length-1
            // console.log(this.count)
            for (var i=0; i<this.dataFilter.length; i++){
                this.diffTime = this.dataFilter[i]-this.dataFilter[0]
            }
            // this.heartRate=((this.diffTime/(this.pushValue-1))/1000)*60
            console.log(this.pushValue)
            this.heartRate=((this.minus2.length+1)*4) //ใช้เวลาวัด 15 วินาที
            // this.heartRate=this.heartRate
            // console.log(this.heartRate)
            // console.log(this.diffTime)

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

    // chart fix 
        chart:function(){
                var count=0;
                var limit = 1500;
                var data = [];
                var dataSeries = { type: "line" };
                var dataPoints = [];
                for (var i = 0; i < limit; i++) {
                    dataPoints.push({
                        x: i*10,
                        y: this.values[i]
                    });
                    count += 1;
                }
                //console.log(count)
                dataSeries.dataPoints = dataPoints;
                data.push(dataSeries);
                
                var options = {
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    zoomEnabled: true,
                    animationEnabled: true,
                    title: {
                        text: "Electrocardiogram (ECG)"
                    },
                    axisY: {
                        includeZero: false,
                        lineThickness: 1
                    },
                    data: data,
                    borderColor: 'rgb(255, 99, 132)',
                };
                
                var chart = new CanvasJS.Chart("chartContainer", options);

                if(count == this.values.length){
                    chart.render();
                }
            
        }

    }, //closed method not chart function

    created(){
        // show data from database
        // messageRef2.on('child_added',snapshot=>{
        //     // push data from database to array
        //     this.values2.push(snapshot.val().value)
        //     this.times2.push(snapshot.val().time)
        //     this.chart();
        // })
        messageRef.on('child_added' ,snapshot=>{
            // push data from database to array
            this.values.push(snapshot.val().value)
            this.times.push(snapshot.val().time)
            //console.log(snapshot.val().time); 
            this.calculate(); 
            this.filter();
            this.storeMessage();
            this.chart();         
        }) 
 


        
    }
})