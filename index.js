var oDl = document.getElementsByClassName('menu')[0]; //获取选中的dl标签
var oTable = document.getElementsByClassName('tbody')[0]; //获取表单数据
var content = document.getElementsByClassName('con'); // 获取内容区
var oDd = oDl.getElementsByTagName('dd'); //获取dd标签
var model = document.getElementsByClassName('modal')[0]; // 获取遮罩层的标签
var oBtn = document.getElementById('add-student-btn'); // 
var tableData = [];
var editStudentForm = document.getElementById('edit');
var mask = document.getElementsByClassName('mask')[0];
var nowPage = 1;
var pageSize = 5;
var prevBtn = document.getElementsByClassName('prev')[0]
var nextBtn = document.getElementsByClassName('next')[0]
var allPage = 1;
// 函数初始化;
function init() {
  bindEvent();
  getTableData();
}
// 绑定事件
function bindEvent() {
  // 绑定点击事件,事件委托到子元素上面
  oDl.addEventListener('click', function (e) {
    var tarName = e.target.nodeName;
    console.log(tarName)
    if (tarName === 'DD') {
      // 切换左侧导航条的样式
      changMenuStyle(e.target);
      var id = e.target.getAttribute('data-id');
      console.log(id);
      changConentStyle(id)
    } else {
      return false;
    }
  }, false);
  // 点击提交事件
  oBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var studentObj = getFormData('add-student-form');
    if (studentObj) {
      transferData('api/student/addStudent', studentObj, function (data) {
        getTableData();
        var flag = window.confirm('添加成功,是否跳转列表页')
        var form = document.getElementById('add-student-form');
        form.reset();
        if (flag) {
          var studentList = document.getElementsByClassName('list')[0];
          studentList.click();
        } else {
          return false;
        }
      });
      // var result = saveData('https://open.duyiedu.com/api/student/addStudent',Object.assign({
      //     appkey:"changlin_clmer_1564063408086"
      //   },studentObj));
      //   if(result.status == 'success'){
      //     var form  = document.getElementById('add-student-form');
      //     form.reset();
      //     var flag = window.confirm('添加成功,是否跳转列表页')
      //     getTableData();
      //     if(flag){
      //       var studentList = document.getElementsByClassName('list')[0];
      //       studentList.click();
      //     }else{
      //       return false;
      //     }
      //   }
      //   if(result.status == 'fail'){
      //     alert(result.msg);
      //   }
    }
  }, false);
  // 点击编辑删除按钮,删除一个学生信息
  oTable.addEventListener('click', function (e) {
    var tarName = e.target.nodeName;
    if(tarName != 'BUTTON'){
      return false;
    }else{
      // 点击修改学生信息
      const btnClassName = [].slice.call(e.target.classList,0); // 获取按钮的类名
      var isEdit = btnClassName.indexOf('edit') > -1;
      var index = e.target.getAttribute('data-index');
      console.log(isEdit)
      if(isEdit){
        model.style.display = 'block';
        // 数据回填
        renderEditForm(tableData[index])
      }
      var isDel = btnClassName.indexOf('del') > -1;
      if(isDel){
        var confirm = window.confirm("是否确认删除"+ tableData[index].name+ "同学的信息吗")
        if(confirm){
          transferData('/api/student/delBySno',{sNo:tableData[index].sNo},function(data){
            alert("删除成功")
            getTableData();
          },'delete')
        }
      }
    }
  },false);
  // 点击编辑按钮
  editStudentForm.addEventListener('click',function(e){
    e.preventDefault();
    var studentObj = getFormData('edit-student-form');
    var form = document.getElementById('edit-student-form');
    if (studentObj) {
      transferData('api/student/updateStudent', studentObj, function () {
        alert("数据更新成功")
        form.reset();
        model.style.display = 'none';
        getTableData();
    })}
  }, false);
  // 点击阴影部分,mask消失
  mask.addEventListener('click',function(e){
    e.preventDefault();
    model.style.display = 'none';
  },false)
}
// 切换左侧导航条的样式
function changMenuStyle(dom) {
  // 移除带有active的样式
  console.log(oDd)
  for (var i = 0; i < oDd.length; i++) {
    oDd[i].classList.remove('active');
  }
  // 添加active样式
  dom.classList.add('active');
}
// 切换右侧内容区
function changConentStyle(id) {
  for (var i = 0; i < content.length; i++) {
    content[i].classList.remove('content-active');
  }
  var showId = document.getElementById(id);
  showId.classList.add('content-active');
}
// 获取表单数据
function getFormData(id) {
  var form = document.getElementById(id)
  var name = form.name.value;
  var sex = form.sex.value;
  var sNo = form.sNo.value;
  var birth = form.birth.value;
  var phone = form.phone.value;
  var address = form.address.value;
  var email = form.email.value;
  if (!name || !sex || !sNo || !birth || !phone || !address || !email) {
    return false;
  }
  if(sNo.leangth< 4 || sNo.length > 16 ){
    alert("学生学号长度为4-16位")
    return false;
  }
  if(birth.leangth != 4 && birth > new Date().getFullYear() || birth < 1900){
    alert("出生年月不符合规范");
    return false;
  }
  
  var obj = {
    name: name,
    sex: sex,
    sNo: sNo,
    birth: birth,
    phone: phone,
    address: address,
    email: email,
  };


  return obj
}
// 获取数据列表
function getTableData() {
  transferData('api/student/findByPage', {page:nowPage,size:pageSize}, function (data) {
    tableData = data;
    allPage = Math.ceil(data.cont / pageSize);
    renderTable(data.findByPage);
  })
}
// 渲染表格数据,使用字符串拼接
function renderTable(data) {
  var str = '';
  data.forEach(function (item, index) {
    str += '<tr> \ <td>' + item.name + '</td> \ <td>' + (item.sex ? "男" : "女") + '</td> \
    <td>'+ item.sNo + '</td> \
    <td>'+ item.email + '</td> \
    <td>'+ (new Date().getFullYear() - item.birth) + '</td> \
    <td>'+ item.phone + '</td> \
    <td>'+ item.address + '</td> \
    <td> \
      <button class="btn edit" data-index='+ index +'>编辑</button> \
      <button class="btn del" data-index='+ index +'>删除</button> \
    </td> \
  </tr> \ ';
  });
  oTable.innerHTML = str;
  if(nowPage == 1 ){
    prevBtn.style.display = 'none';
  }else if(nowPage == allPage){
    nextBtn.style.display = 'none';
  }else{
    prevBtn.style.display = 'inline-block';
    nextBtn.style.display = 'inline-block';
  }
}
// 点击上一页的事件
prevBtn.onClick = function(){
  if(nowPage < 1){
    nowPage -- ;
  }
  getTableData()
};
// 点击下一页的事件
nextBtn.onclick = function(){
  if(nowPage < allPage){
    nowPage ++ ;
  }
  getTableData()
}
// 降低代码冗余度
function transferData(path, data, cb) {
  var result = saveData('https://open.duyiedu.com/' + path, Object.assign({
    appkey: "changlin_clmer_1564063408086",
  }, data))
  if (result.status == 'success') {
    cb(result.data)
  } else if (result == 'fail') {
    alert(result.msg);
  }
}
// 渲染编辑表单的数据以及数据回填。
function renderEditForm(data) {
  var form = document.getElementsByClassName('edit-student-form')[0];
  // 渲染表格数据
  for(var prop in data){
    if(form[prop]){
      console.log(data[prop])
      form[prop].value = data[prop]
    }
  }
  
}
// 切换上一页和下一页
init();





































// 向后端存储数据 url 接口地址  param 请求参数
// ajax
function saveData(url, param) {
  var result = null;
  var xhr = null;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if (typeof param == 'string') {
    xhr.open('GET', url + '?' + param, false);
  } else if (typeof param == 'object') {
    var str = "";
    for (var prop in param) {
      str += prop + '=' + param[prop] + '&';
    }
    xhr.open('GET', url + '?' + str, false);
  } else {
    xhr.open('GET', url + '?' + param.toString(), false);
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        result = JSON.parse(xhr.responseText);
      } else {
        result = {
          status: xhr.status,
          msg: xhr.status + '服务器错误'
        }
      }
    }
  }
  xhr.send();
  return result;
}