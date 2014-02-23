<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<div class="worktable">
<table width="10%" border="0" class="table-css" style="float: left;" id="table1">
	<tr>
		<th class="mark" width="50"><input id="checkAll" type="checkbox" onclick="selectAll(this)"/><label for="checkAll">工号</label></th>
		<th class="mark" style="border-right: none;">姓名</th>
	</tr>
	<c:if test="${empty archiveSchedules}">
		<tr class="sche">
			<td colspan="${workdays.size()+2}" style="border-right: none;">
			</td>
		</tr>
	</c:if>
	<c:forEach items="${archiveSchedules}" var="as" varStatus="vs">
		<tr class="sche">
			<td class="mark workDayType${d.type+(vs.index%2)*3}"><input id="checkBox${as.archive.id}" type="checkbox" onclick="check(this,'checkAll')" lang="a" class="line${vs.count}"/><label for="checkBox${as.archive.id}">${as.archive.num}</label></td>
			<td class="mark workDayType${d.type+(vs.index%2)*3}" style="border-right: none;" name="a_ids" lang="${as.archive.id}">${as.archive.name}</td>
		</tr>
	</c:forEach>
</table>
<table width="90%" border="0" class="table-css" id="table2">
	<tr>
		<th class="mark" width="3%"></th>
		<c:forEach begin="1" end="${workdays.size()}" var="d">
			<th class="mark" id="month-num">${d}</th>
		</c:forEach>
	</tr>
	<c:if test="${empty archiveSchedules}">
		<tr class="sche">
			<td colspan="${workdays.size()+2}" style="border-left: none;">
			</td>
		</tr>
	</c:if>
	<c:forEach items="${archiveSchedules}" var="as" varStatus="v">
		<tr class="sche">
			<td class="rowhandler workDayType${d.type+(v.index%2)*3}" width="31px"><div class="drag row"></div></td>
			<c:forEach var="d" items="${workdays}" varStatus="vs">
				<td class="workDayType${d.type+(v.index%2)*3} canSelect" lang="${d.date}" onclick="showTdSelect(this,'setUp'),stopPropagation()"
					title="${weeks[(firstDayOfWeek +vs.count-1)%7]}">
					<c:if test="${as.schedules[d.date]!=null}">
						<c:forEach items="${workShifts}" var="ws">
							<c:if test="${ws.id==as.schedules[d.date].work_shift_id}">
								<div class="drag" lang="${ws.id}" style="background-color: #${ws.iconColor}">${ws.icon}</div>
							</c:if>
						</c:forEach>
					</c:if>
				</td>
			</c:forEach>
		</tr>
	</c:forEach>
</table>
</div>

<div class="point-out">
    <p class="point"><span>*提示：</span>请直接在日期表格上点击鼠标左键进行班次设置；其中灰色背景表格表示公休日,淡黄色背景表格表示节假日。</p>
    <ul>
        <li>共${count}条</li>
        <li>每页
        <input type="text" style="width: 20px;height: 16px;" 
        value="${pageSize}" name="pageSize" onpropertychange="this.value=this.value.replace(/\D|^0/g,'')" 
        oninput="this.value=this.value.replace(/\D|^0/g,'')" maxlength="3" 
        onkeydown="javascript:if(event.keyCode==13)schenduleAjax();"
        />条</li>
        <li><a href="javascript:void(0)" <c:if test="${page>1}">onclick="toPage(${page-1})"</c:if>>上一页</a></li>
        <li>第
             <select onchange="toPage(this.value)">
             	<c:forEach begin="1" end="${maxPage}" var="i">
             		<option value="${i}" 
             		<c:if test="${page==i}">selected="selected"</c:if>>${i}</option>
             	</c:forEach>
             </select>页
        </li>
        <li><a href="javascript:void(0)" <c:if test="${page<maxPage}">onclick="toPage(${page+1})"</c:if>>下一页</a></li>
    </ul>
</div>