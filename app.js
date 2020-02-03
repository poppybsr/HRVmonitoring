const database = firebase.database();
const messageRef = database.ref("sensor");
new Vue({
    el:"#age",
    data:{
        age:Int16Array,
        time:'',
        times:[],
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
            console.log(snapshot.val());
        })
    }

    
})