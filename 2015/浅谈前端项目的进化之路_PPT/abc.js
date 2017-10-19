
//dispatcher
var AppDispatcher = require('flux').Dispatcher;

//action
var AppActions = {
    add: function(value) {
        //ajax
        AppDispatcher.dispatch({
            eventName: 'addText',
            item : value
        });
    }
};

//store
var EventEmitter = require("events").EventEmitter;

var _list = [ {key:1, name: 'aaa'} ];
function AppStore(){
    EventEmitter.call(this);
}

AppStore.prototype = new EventEmitter();

AppStore.prototype.getList = function(){
    return _list;
};
AppStore.prototype.emitChange = function(){
    this.emit("change");
};
AppStore.prototype.addChangeListener = function(callback){
    this.on("change" ,callback);
};
AppStore.prototype.removeChangeListener = function(callback){
    this.removeListener("change" ,callback)
};

var _appStore = new AppStore();

AppDispatcher.register( function( event ) {
    switch( event.eventName ) {
        case 'addText':
            _list.push(event.item);
            _appStore.emitChange();
            break;
    }

    return true;
});

//view
var Hello = React.createClass({
    getInitialState: function() {
         return { updated : false };
    },

    componentDidMount: function() {
        _appStore.addChangeListener( this.appStoreChanged );
    },

    componentWillUnmount: function() {
        _appStore.removeChangeListener( this.appStoreChanged );
    },

    appStoreChanged: function(){
    	this.setState( updated: !this.state.updated );
    },
    
    addText: function(){
	AppActions.add({
               key : "5",
               name  : "abcdef"
            });
    },

     render: function() {
     	var list = _appStore.getList();
             var _this =  this;
             var html = list.map( function( obj ){
    		return <div key={ obj.key } onClick={_this.addText}> hello {obj.name} </div>;
        });

        return <div> {html} </div>;
        }
});
	 
ReactDOM.render(
    <Hello/>,
    document.getElementById('container')
);