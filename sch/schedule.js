/**
 * 自动排班
 */
function autoSched(){
	if(getCheckedCount('a')==0){
		parent.$.messager.alert('提示','请至少选择一位员工','warning');
//		alert('请至少选择一位员工');
	}else{
		showSelectWindow();
	}
}

/**
 * 显示班次选则
 */
function showSelectWindow(){
	var obj = document.getElementById("workShiftWindow");
	obj.style.display='block';
	oRect = obj.getBoundingClientRect();  
	w=oRect.width;
	h=oRect.height;
	obj.style.left= ($("#width").width()-w)/2+"px";
	obj.style.top= (window.screen.height-140-h)/2+"px";
}

/**
 * 隐藏班次选则
 */
function hideSelectWindow(){
	document.getElementById("workShiftWindow").style.display='none';
}

/**
 * 自动排选中的员工
 */
function autoSchedule(w_s_id){
	if(getCheckedCount('a')==0){
		hideSelectWindow();
	}else{
		var div = REDIPS.drag.cloneObject(document.getElementById("w_s_"+w_s_id));
		div.setAttribute('class','drag');
		div.removeAttribute('id');
		var ips=document.getElementsByTagName("input");
		for(var i = 0; i < ips.length; i++){
			if((ips[i].type=="checkbox") && (ips[i].getAttribute('lang')=='a') && ips[i].checked){
				autoScheduleRow(ips[i],div);
			}
		}
		hideSelectWindow();
		cleanCheckBox();
		REDIPS.drag.init();
	}
}
/**
 * 根据传入的checkBox对象，返回该行的td对象
 * @param objclass
 * @returns
 */
function getRowTdsByClass(objclass){
	var s = parseInt(objclass.getAttribute('class').substring(4));
	return $('#table-css tr:eq('+s+') td');
}
/**
 * 自动排一人
 */
function autoScheduleRow(obj,div){
	var ips = getRowTdsByClass(obj);
	for(var i = 0; i < ips.length; i++){
		if(ips[i].getAttribute('class').indexOf('canSelect')>-1){
			clean(ips[i]);
		}
		if(ips[i].getAttribute('class').indexOf('workDayType0')>-1){
			ips[i].appendChild(div.cloneNode(true));
		}
	}
}
/**
 * 完全清除所有选中的员工的排班记录
 */
function cleanSched(){
	if(getCheckedCount('a')==0){
		parent.$.messager.alert('提示','请至少选择一位员工','warning');
//		alert('请至少选择一位员工');
		return;
	}
	var ips=document.getElementsByTagName("input");
	for(var i = 0; i < ips.length; i++){
		if((ips[i].type=="checkbox") && (ips[i].getAttribute('lang')=='a') && ips[i].checked){
			cleanWS(ips[i]);
		}
	}
}
/**
 * 清除一行的排班，传入checkBox的class属性
 */
function cleanWS(obj) {
	var ips = getRowTdsByClass(obj);
	for(var i = 0; i < ips.length; i++){
		if(ips[i].getAttribute('class').indexOf('canSelect')>=0){
			clean(ips[i]);
		}
	}
}
/**
 * 清空所有checkBox
 */
function cleanCheckBox(){
	var ips=document.getElementsByTagName("input");
	for(var i = 0; i < ips.length; i++){
		if(ips[i].type=="checkbox"){
			ips[i].checked=false;
		}
	}
}

/**
 * 返回checkbox或radio选择的数量
 * 参数：langFilter 可选 通过<input type="checkbox" lang="abc"中的abc进行分组过滤
 */
function getCheckedCount(langFilter){
	var ips=document.getElementsByTagName("input");
	var nn=0;
	for(var i = 0; i < ips.length; i++)
		if((ips[i].type=="checkbox" || ips[i].type=="radio" ) && (langFilter==null||ips[i].getAttribute('lang')==langFilter) && ips[i].checked)
			nn++;
	return nn;
}

/**
 * 清除单个div的子元素
 * @param obj
 */
function clean(obj){
	var childs = obj.childNodes;    
	for(var i = childs.length - 1; i >= 0; i--) {      
		obj.removeChild(childs[i]);      
	}
}
/**
 * 设置和取消单个td的排班
 */
var DAYID;
function setWS(id){
	var div = REDIPS.drag.cloneObject(document.getElementById("w_s_"+id));
	div.setAttribute('class','drag');
	div.removeAttribute('id');
	clean(DAYID);
	DAYID.appendChild(div);
	REDIPS.drag.init();
}
function cleanTD(){
	clean(DAYID);
}

/**
 * checkBox方法
 */
function selectAll(obj){
	var ips=document.getElementsByTagName("input");
	var isChecked=obj.checked;
	for(var i = 0; i < ips.length;i++)
		if(ips[i].type=="checkbox")
			if(ips[i]!=obj&&!ips[i].disabled)
				ips[i].checked=isChecked;
}

/**
 * 单选
 */
function check(obj,checkAllId){
	var ips=document.getElementsByTagName("input");
	langFilter = obj.getAttribute('lang');
	for(var i = 0; i < ips.length;i++){
		if(ips[i].type=="checkbox" && (langFilter==null || ips[i].getAttribute('lang')==langFilter)){
			if(!ips[i].checked){
				document.getElementById(checkAllId).checked=false;
				return;
			}
		}
	}
	document.getElementById(checkAllId).checked=true;
}
/**
 * 月份选择，上个月
 */ 
function lastMonth(){
	date = parseInt(document.getElementById("date").value);
	var newMonth = date%100==1?date-89:date-1;
	document.getElementById("date").value = newMonth;
	schenduleAjax();
}
/**
 * 月份选择，下个月
 */ 
function nextMonth(){
	date = parseInt(document.getElementById("date").value);
	var newMonth = date%100==12?date+89:date+1;
	document.getElementById("date").value = newMonth;
	schenduleAjax();
}
/**
 * 保存排班
 */
function saveSched(){
	//生成json对象
	var list = "[";
	//通过name值为a_ids的td能获取当前页面的员工id
	var tds = document.getElementsByName('a_ids');
	//获取一行的具体排班数据
	var trs = document.getElementById("table-css").getElementsByTagName("tr");
	//去掉第一个td，第一个td为拖拽整行专用
	for(var i = 1;i<trs.length;i++){
		//获取对应的员工
		var a_id = tds[i-1].getAttribute('lang');
		//通过同一行的td获取排班数据
		td1s = trs[i].getElementsByTagName("td");
		for(var k = 1;k<td1s.length;k++){
			//具体日期
			var date = td1s[k].getAttribute('lang');
			//通过td里面是否有表示班次的div来设置json对象，没有则生成无w_s_id(班次id)属性的json对象，后台能识别处理
			var s = td1s[k].childNodes;
			//拼接json对象
			if(s.length==0){
				list+="{'a_id':"+a_id+',date:'+
				date
				+"},";
			}
			for(var j=0;j<s.length;j++){
				if(s[j].tagName=="DIV"){
					list+="{'a_id':"+a_id+',date:'+
					date
					+",'w_s_id':"+s[j].getAttribute('lang')
					+"},";
					break;
				}
			}
		}
	}
	//去掉最后的逗号
	if(list.length>1)
		list = list.substring(0, list.length-1);
	list+="]";
	//发送请求
	$.ajax({
		url:'saveSched',
		type:'post',
		data:{'data':list,'month':$('#month').val()},
		dataType:'text',
		success:function(data){
			if(data=='success'){
				parent.$.messager.alert('提示','排班成功','info');
			}else{
				parent.$.messager.alert('提示','排班失败','error');
			}
		},
		error:function(){
			alert('系统故障');
		}
	});
}
/**
 * 显示/隐藏班次明细
 */
function toggleWS(){
	$("#classes-nr").toggle(300);
}
/**
 * 查询方法
 */
function schenduleAjax(){
	$('#month').val($('#date').val());
	$('#schenduleAjax').ajaxSubmit({
		url:"schenduleAjax",
		type:'post',
		dataType:'html',
		success:function(html){
			$('#table').html(html);
			redipsInit();
		},
		error:function(){
			alert('查找失败');
		}
	});
}

/**
 * 拖拽方法和页面初始化
 * @returns
 */
var redipsInit = function () {
	/*拖拽方法初始化*/
	var rd = REDIPS.drag,	// 载入
	clonedDIV = false;
	// 配置
	rd.init();
	// 设置背景拖拽颜色
	rd.hover.colorTd = '#9BB3DA';
	// 相互交换
	rd.event.droppedBefore = function (targetCell) {
		var empty = rd.emptyCell(targetCell, 'test');
		var div;
		if(empty&&rd.obj.id.length>1){
			div = rd.cloneObject(rd.obj);
			div.id = '';
			rd.td.target.appendChild(div);
			return false;
		}
		if (!empty) {
			rd.enableDrag(true, rd.td.target);
			if(rd.obj.id.length>1){
				rd.emptyCell(rd.td.target);
				div = rd.cloneObject(rd.obj);
				div.id = '';
				rd.td.target.appendChild(div);
				return false;
			}else if (!clonedDIV) {
				rd.relocate(rd.td.target, rd.td.source);
				rd.td.target.appendChild(rd.obj);
			}
			return false;
		}
	};
	// 行拖拽设置
	rd.rowDropMode="overwrite";
	// 点击任意对象隐藏班次选择框
	$('body').click(function(e){
		$('#setUp').hide();
	});
//	$(".worktable table tr").mouseover(function(){
//		changBGC($(this));
//	});
//	$(".worktable table tr").mouseout(function(){
//		refBGC($(this));
//	});
	//设置页面div容器的固定宽度
	if($('#width').width()<1135){
		$('#drag').width(1135);
	}else{
		$('#drag').width($('#drag').width());
	}
};

/**
 * 载入方法
 */
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}
/**
 * 翻页
 */
function toPage(page){
	$('#schenduleAjax').ajaxSubmit({
		url:"schenduleAjax",
		type:'post',
		dataType:'html',
		data:{'page':page},
		success:function(html){
			$('#table').html(html);
			redipsInit();
		},
		error:function(){
			alert('查找失败');
		}
	});
}

/**
 * 部门弹窗方法
 */
function popup2(w,h,title,url,frmobj){
	var diag = new Dialog(frmobj);
	diag.Width = w;
	diag.Height = h;
	diag.Title = title;
	diag.URL = url;
	diag.OKEvent = function(){
		$('#dep').val(diag.innerFrame.contentWindow.document.getElementById('deptname').value);
		$('#dep_id').val(diag.innerFrame.contentWindow.document.getElementById('deptid').value);
		diag.close();
	};
	diag.show();
}

//var defColor = 0xffffff - 0xedf8ff;
//function changBGC(trObj){
//	index = $(trObj).parent().find("tr").index($(trObj));
//	$("#table1 tr:eq("+index+")").find("td").each(function(){
//		color = $(this).attr("bgcolor") == null?"#ffffff":$(this).attr("bgcolor");
//		color = parseInt("0x"+color.substring(1, 7));
//		color = color - defColor;
//		$(this).attr("bgcolor","#"+color.toString(16));
//	});
//	$("#table2 tr:eq("+index+")").find("td").each(function(i){
//		if(i == 0){
//			color = $(this).attr("bgcolor") == null?"#ffffff":$(this).attr("bgcolor");
//			color = parseInt("0x"+color.substring(1, 7));
//			color = color - defColor;
//			$(this).attr("bgcolor","#"+color.toString(16));
//		}else{
//			classname = $(this).attr("class");
//			key = parseInt(classname.substring(11,12));
//			classname0 = classname.substring(0,11);
//			classname1 = classname.substring(12,classname.length);
//			key = key>2?key-3:key+3;
//			$(this).attr("class",classname0+key+classname1);
//		}
//	});
//}
//function refBGC(trObj){
//	index = $(trObj).parent().find("tr").index($(trObj));
//	$("#table1 tr:eq("+index+")").find("td").each(function(){
//		color = $(this).attr("bgcolor") == null?"#ffffff":$(this).attr("bgcolor");
//		color = parseInt("0x"+color.substring(1, 7));
//		color = color + defColor;
//		$(this).attr("bgcolor","#"+color.toString(16));
//	});
//	$("#table2 tr:eq("+index+")").find("td").each(function(i){
//		if(i == 0){
//			color = $(this).attr("bgcolor") == null?"#ffffff":$(this).attr("bgcolor");
//			color = parseInt("0x"+color.substring(1, 7));
//			color = color + defColor;
//			$(this).attr("bgcolor","#"+color.toString(16));
//		}else{
//			classname = $(this).attr("class");
//			key = parseInt(classname.substring(11,12));
//			classname0 = classname.substring(0,11);
//			classname1 = classname.substring(12,classname.length);
//			key = key>2?key-3:key+3;
//			$(this).attr("class",classname0+key+classname1);
//		}
//	});
//}