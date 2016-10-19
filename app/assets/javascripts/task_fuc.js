(function(){
	$(document).ready(function(){

		//获取项目的评分情况
		$.ajax({
			method:'GET',
			url:'/api/needs/' + need_id + '/vote_sum',
		}).done(function(data){
			if(data.vote_speed && parseInt(data.vote_speed) > 0){
				//有评分，显示分数
				$('.vote_sum_block').toggle();
			}else{
				//没有评分，如果是甲方，则显示打分，如果是乙方，则不显示
				$('.vote_block').show();
			}
		})

		//文件上传
		$('.attachment_file_upload').fileupload({
	        dataType: 'json',
	        submit: function(e, data){
	          // $('.fileupload-buttonbar').toggleClass('active');
	          var id = data.form.attr("id");
	          id = id.split('-')[1];
	          $('#plan_task_' + id + ' .task-result-files ul').prepend('<li class="uploading"><a>上传中</a></li>')
	        },
	        progressall: function (e, data) {
	          var progress = parseInt(data.loaded / data.total * 100, 10);
	          $('.task-result-files li.uploading>a').html(progress+"%");
	        },
	        done: function (e, data) {
	        	var obj = data.result;
	        	$('.task-result-files li.uploading').remove();
				$('#plan_task_'+obj.attachmentable_id+" .task-result-files ul").prepend('<li class="text-center"><span>'+
					'<a href="' + obj.file_url  + '">'+
					'<img src="' + obj.file_url + '?imageView2/1/w/200/h/200">'+
					'</a></span></li>')
				console.log();
	        }
	    });

		//设置计划弹窗中的日期选择
		$('.deadLineDataPicker').datetimepicker({
		    format: 'yyyy-mm-dd',
		    autoclose: true,
		    minView: 2,
		    language: 'zh-CN'
		});
		
		//日历
		$('.responsive-calendar').responsiveCalendar({
	        time: firstTaskData,
	        events: taskData
	    });	

		//设置计划弹窗中的修改任务（task）按钮
	    $(".updatePlanBtn").click(function(evt){
	    	var planId = $(evt.currentTarget).attr("data-plan");
	    	var formId = "#plan_f_"+planId;
	    	var PatchData = $(formId).serialize();

	    	var purl = "/api/plans/"+planId;
	    	// console.log(PatchData);
	    	$.ajax({
	    		method:"PATCH",
	    		url:purl,
	    		data:PatchData
	    	}).done(function(msg){
	    		var planObj = msg.plan;
	    		var output = $("#plan-unit-"+planObj.id+" .plan-output")
	    		output.find("span.plan-time").html(planObj.dead_line);
	    		output.find("span.plan-title").html(planObj.title);
	    		togglePlanEdit(planObj.id);
	    	});
	    });

	    //设置计划弹窗中的删除任务（task）按钮
	    $(".delPlanBtn").click(function(evt){
	    	var planId = $(evt.currentTarget).attr("data-plan");
	    	var purl = "/api/plans/"+planId;

	    	$.ajax({
	    		method:"DELETE",
	    		url:purl	
	    	}).done(function(msg){
	    		$("#plan-unit-"+planId).remove();
	    	});
	    })

	    //设置计划弹窗中的创建任务（task）按钮
	    $(".createPlanBtn").click(function(evt){
	    	var needId = $(evt.currentTarget).attr("data-need");
	    	var formData = $("#create_plan_form").serializeArray();


	    	$.ajax({
	    		method: "POST",
	    		url:"/api/needs/"+needId+"/plans",
	    		data: formData
	    	}).done(function(msg){
	    		$(".collapse#new-plan-form").before(createPlanUnit(msg.plan_id,formData[0].value,formData[1].value));
	    		$(".collapse#new-plan-form").collapse('toggle');	    		
	    	});
	    })

	    $(".editPlanBtn").click(function(evt){
	    	var planId = $(evt.currentTarget).attr("data-plan");
	    	togglePlanEdit(planId);

	    });

	    $(".cancleUpdateplanBtn").click(function(evt){
	    	var planId = $(evt.currentTarget).attr("data-plan");
	    	togglePlanEdit(planId);
	    })
	})

	var togglePlanEdit = function(planId){
		$("#plan-unit-"+planId+" .plan-output").toggleClass("hidden");
	    $("#plan-unit-"+planId+" .plan-input").toggleClass("hidden");
	}

	var createPlanUnit = function(_planId, _time, _title){
		return "	<div class='plan-unit' id='plan-unit-"+_planId+"'>" +
					"  <div class='plan-output'>" +
					"    <span class='plan-time'>"+_time+"</span>" +
					"    <span class='plan-title'>"+_title+"</span>" +
					"    <span class='plan-action'>" +
					"      <a class='editplanBtn' data-plan='"+_planId+"' href='javascript:void(0)'>编辑</a>" +
					"      <a class='delplanBtn' data-plan='"+_planId+"' href='javascript:void(0)'>删除</a>" +
					"    </span>" +
					"  </div>" +
					"  <div class='plan-input hidden'>" +
					"    <form id='plan_f_"+_planId+"'>" +
					"      <span class='plan-time'>" +
					"		<div class='form-group'>" +
					"        <input class='form-control deadLineDataPicker' type='text' name='plan[dead_line]' placeholder='请选择日期' readonly value='"+_time+"'>" +
					"		</div>" +
					"      </span>" +
					"      <span class='plan-title'>" +
					"		<div class='form-group'>" +
					"        <input class='form-control' type='text' name='plan[title]' value='"+_title+"'>" +
					"		</div>" +
					"      </span>" +
					"      <span class='plan-action'>" +
					"        <a class='updateplanBtn' data-plan='"+_planId+"' href='javascript:void(0)'>保存</a>" +
					"        <a class='cancleUpdateplanBtn' data-plan='"+_planId+"' href='javascript:void(0)'>取消</a>" +
					"      </span>" +
					"    </form>" +
					"  </div>" +
					"</div>";
	}

	


}());

