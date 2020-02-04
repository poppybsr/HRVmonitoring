const database = firebase.database();
const messageRef = database.ref("sensor");
// const ageRef = database.ref("age")
// const arrMax = arr => Math.max(times);


new Vue({
    el:"#age",
    data:{
        age:'',
        time:'',
        times:[],
        allTime:[],
        valueECG:'',
    },
    methods:{
        storeMessage:function(){
            messageRef.push({time:this.time,value:this.valueECG})
            this.time=''
        }
    },
    
    created(){
        // show data from database
        messageRef.on('child_added' ,snapshot=>{
            // push data from database to array
            this.times.push(snapshot.val())
        })

        console.log(this.times)
    },
        

})