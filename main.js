var STORAGE_KEY = 'todos-vuejs-2.0';
var todoStorage = {
  fetch: function(){
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    todos.forEach(function(todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save: function(todos){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};

var filters = {
  all: function(todos){
    return todos;
  },
  active: function(todos){
    return todos.filter(function(todo){
      return !todo.completed;
    });
  },
  completed: function(todos){
    return todos.filter(function(todo){
      return todo.completed;
    });
  }
};

var app = new Vue({
  data:{
    todos: todoStorage.fetch(),
    newTodo:'',
    value:'',
    edit: false,
    editedTodo: null,
    visibility: 'all',
  },
  watch:{
    todos: {
      handler: function(todos){
        todoStorage.save(todos);
      },
      deep: true
    }
    
  },
  computed: {
    todoLists: function(){
      return filters[this.visibility](this.todos);
    },
    remaining: function(){
      return filters.active(this.todos).length;
    },
    allDone:{
      get: function(){
        return this.remaining === 0;
      },
      set: function(value){
        this.todos.forEach(function(todo){
          todo.coompleted = value;
        });
      }
    }
  },
  filters: {
    case: function(n){
      if( n === 1){
        return 'case';
      }else{
        return 'cases';
      }
    }
  },
  directives:{
    focus:{
      inserted: function(el){
        el.focus();
      }
    }
  },
  methods:{
    addTodo: function(){
      var value = this.newTodo ;
      if(!value){
        return;
      }
      this.todos.push({
        id:todoStorage.uid++,
        title: value,
        completed: false
      });
      this.newTodo ='';
    },
    removeTodo: function(todo){
      this.todos.splice(this.todo.indexOf(todo), 1);
    },
    
    editTodo(todo){
      this.edit = true;
    },
    
    allRemoved: function(todo){
      this.todos = filters.active(this.todos);
    }
  },
});

function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '');
  if(filters[visibility]){
    app.visibility = visibility;
  }else {
    window.location.hash = '';
    app.visibility = 'all';
  }
}

window.addEventListener('hashchange', onHashChange);
onHashChange();

app.$mount('.todoapp');