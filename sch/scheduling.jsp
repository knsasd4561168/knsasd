<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="css/table.css" rel="stylesheet" type="text/css" />
<link href="css/right.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/redips-drag-source.js"></script>
<script type="text/javascript" src="js/datepicker/WdatePicker.js"></script>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery.form.js"></script>
<script type="text/javascript" src="js/attendance/schedule.js"></script>
<script type="text/javascript" src="js/zDialog.js"></script>
<!--区分排班表里工作日和休息日  -->
<style>
.workDayType0{
	background-color: #FFF;
}
.workDayType1{
	background-color: #f0f0f0;
}
.workDayType2{
	background-color: #ffeea0;
}
.workDayType3{
	background-color: #edf8ff;
}
.workDayType4{
	background-color: #dee9f0;
}
.workDayType5{
	background-color: #ede7a0;
}
<!--清除 -->
.trash{
	font-size:20px;
	width: 100px;
	height: 50px;
	background-color: #6666ff;
}
.row {
	width: 10px;
	margin: 2px;
	height: 10px;
	border-color: SteelBlue;
	background-color: SteelBlue;
	/* round corners */
	border-radius: 14px; /* Opera, Chrome */
	-moz-border-radius: 14px; /* FF */
}
</style>
</head>

<body>
<div id="drag">
	<form id="schenduleAjax" action="schenduleAjax">
		<div class="staff-search" >
			<p class="search">查询条件</p>
			<div class="staff-seach-nr">
				<table width="100%" border="0">
					<tr>
						<td class="Sch-month mark"><span>月份：</span><label onclick="lastMonth()">&lt;</label>
							<input id="date" name="work_date" class="Wdate" value="${month }" onfocus="WdatePicker({isShowclean:false,readOnly:true,dateFmt:'yyyyMM'});" readonly="readonly" style="float: left;"/>
							<input id="month" type="hidden" value="${month}"/>
						<label onclick="nextMonth()">&gt;</label></td>
						<td class="mark">部门：<input type="text" id="dep" class="find_input" readonly="readonly" onclick="popup2(500,400,'请选择部门','deptTree','deptTree')" value="${staff.dep_name}"/>
							<input type="hidden" name=department_id id="dep_id" value="1"/>
						</td>
						<td class="mark">姓名：<input type="text" name="name"/></td>
						<td class="mark">工号：<input type="text" name="num"/></td>
						<td class="search-button mark"><input type="button" value="查询" onclick="schenduleAjax()"/></td>
					</tr>
				</table>
			</div>
		</div>
<p class="staff-button">
<input type="button" value="快速排班" onclick="autoSched()"/>
<input type="button" value="清除" onclick="cleanSched()" />
<input type="button" value="保存" onclick="saveSched()" />
</p>
<div id="table">
	<jsp:include page="/WEB-INF/page/attendance/scheduleAjax.jsp" />
</div>
<div class="classes-time">
     <p class="lookdetail" style="cursor: pointer;width: 80px" onclick="toggleWS()">【班次明细】</p>
     <div class="classes-nr" id="classes-nr">
     	<c:forEach items="${workShifts}" var="s">
     		<c:if test="${s.shift_using_status_id==1 }">
     		<table border="0" class="ct-table" cellpadding="0" cellspacing="0">
     			<tr style="height: 26px;">
     				<td class="clNrTit mark" name="mark" style="border-top:none;height: 26px;" id="td${s.id}"><div id="w_s_${s.id}" class="drag clone" lang="${s.id}" style="float:left; background-color: #${s.iconColor};">${s.icon}</div>
     				<b>${s.name}</b>
     				</td>
     			</tr>
     			<tr>
     				<td class="mark">${s.start_time }至
			    	<c:if test="${s.cross_days==0}">当日</c:if>
			    	<c:if test="${s.cross_days>0}">次日</c:if>
			    	${s.finish_time}</td>
     			</tr>
     			<tr>
     				<td class="mark">${s.explanation}</td>
     			</tr>
     		</table>
     		</c:if>
     	</c:forEach>
     	<!-- <table style="float: left;border: 1px ff8000 silver;">
     	<tr><td class='trash' align="center">清除</td></tr>
     </table> -->
     </div>
</div>
</form>
</div>
<div id="workShiftWindow" style="display: none;position: absolute;">
    <p class="workpbtit"><b>快速排班</b><span style="cursor: pointer;" onclick="hideSelectWindow()">关闭</span></p>
    <ul>
	<c:forEach items="${workShifts}" var="s">
		<c:if test="${s.shift_using_status_id==1 }">
			<li style="height: 30px;cursor: pointer;" onclick="autoSchedule(${s.id})"><div class="drag" style="float:left; background-color: #${s.iconColor}">${s.icon}</div>${s.name}</li>
		</c:if>
	</c:forEach>
	</ul>
</div>
<div id="width" style="width: 100%;height: 100%;"></div>

<div id="setUp" onblur="hide()">
<p class="setupimgjt"><img src="images/worksetUp.png"/></p>
<ul>
	<c:forEach items="${workShifts}" var="s">
		<c:if test="${s.shift_using_status_id==1 }">
			<li onclick="setWS(${s.id})"><div class="drag" style="float:left; background-color: #${s.iconColor}">${s.icon}</div><b>${s.name}</b></li>
		</c:if>
	</c:forEach>
	<li class="setclear" style="padding:2px 5px 2px 0px;" onclick="cleanTD()">[清除]</li>
</ul>
</div>
</body>
</html>