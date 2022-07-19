class DashboardController < ApplicationController
  require 'json'
  require 'ostruct'
  require 'date'
  before_action :require_user, :session_active?


  def index
    puts session[:oktastate]['credentials']['token']
    
    st = 3.months.ago.strftime("%Y-%m-%d %H:%M:%S.%6N")
    et = Time.now.strftime("%Y-%m-%d %H:%M:%S.%6N")

    if params[:refresh]=="hard_refresh"
      puts "hard refresh"
      @response = FetchData.get_events(session,event_type=false,st,et,hard_refresh=true,uid=session[:oktastate]['uid'])
      @response_step = FetchData.get_datastreams(session,source="google-fit",data_type="com.personicle.individual.datastreams.step.count",start_date=st, end_date=et, hard_refresh=true,uid=session[:oktastate]['uid'])
      @response_weight = FetchData.get_datastreams(session,source="google-fit",data_type="com.personicle.individual.datastreams.weight",start_date=st, end_date=et, hard_refresh=true,uid=session[:oktastate]['uid'])
    else
      puts "not hard refresh"
      @response = FetchData.get_events(session,event_type=false,st,et,hard_refresh=false,uid=session[:oktastate]['uid'])
      @response_step = FetchData.get_datastreams(session,source="google-fit",data_type="com.personicle.individual.datastreams.step.count",start_date=st, end_date=et, hard_refresh=false,uid=session[:oktastate]['uid'])
      @response_weight = FetchData.get_datastreams(session,source="google-fit",data_type="com.personicle.individual.datastreams.weight",start_date=st, end_date=et, hard_refresh=true,uid=session[:oktastate]['uid'])
    end 

    # @is_physician = session["physician"] 
    # puts @is_physician
    if !@response.empty?
      # @response = JSON.parse(res,object_class: OpenStruct)
      # last_month_total_sleep, last_month_sleep_events
      # last_week_total_sleep, last_week_sleep_events
      
    respond_to do |format|
      format.html
      format.json { render json: UserEventsDatatable.new(params) }
    end

      @sleep_events = @response.select {|event| event['event_name'] == 'Sleep'}
      # duration is in milliseconds in the data packet
      @last_month_total_sleep = @sleep_events.select {|event| event['start_time'].to_datetime > 30.days.ago}.sum {|event| event['parameters']['duration']}/(60*1000)
      @last_month_sleep_event = @sleep_events.select {|event| event['start_time'].to_datetime > 30.days.ago}.size
      @last_week_total_sleep = @sleep_events.select {|event| event['start_time'].to_datetime > 7.days.ago}.sum {|event| event['parameters']['duration']}/(60*1000)
      @last_week_sleep_event = @sleep_events.select {|event| event['start_time'].to_datetime > 7.days.ago}.size
      
      @last_week_average_sleep = @last_week_sleep_event>0? @last_week_total_sleep/@last_week_sleep_event:0
      @last_month_average_sleep = @last_month_sleep_event>0? @last_month_total_sleep/@last_month_sleep_event:0
      # puts @response
      # puts @last_week_sleep_event
    end
 

    if !@response_step.empty?
    
      tmp_steps = @response_step.select {|record| record['timestamp'].to_datetime > 30.days.ago}.map {|rec| [rec['timestamp'].to_date, rec['value']]}.group_by {|r| r[0]}.to_h
      @daily_steps = tmp_steps.map {|k,v| [k, v.sum {|r| r[1]}]}.to_h
      # puts @daily_steps

      @last_month_total_steps = @daily_steps.select {|k,v| k > 30.days.ago}.sum {|k,v| v}
      @last_month_steps_days = @daily_steps.select {|k,v| k > 30.days.ago}.size
      @last_week_total_steps = @daily_steps.select {|k,v| k > 7.days.ago}.sum {|k,v| v}
      @last_week_steps_days = @daily_steps.select {|k,v| k > 7.days.ago}.size

      @last_week_average_steps = @last_week_steps_days>0? @last_week_total_steps/@last_week_steps_days:0
      @last_month_average_steps = @last_month_steps_days>0? @last_month_total_steps/@last_month_steps_days:0
    end

    if !@response_weight.empty?
      #puts @response_weight
      # puts 'Weight Response'
      tmp_weight = @response_weight.group_by_day{|rec| rec['timestamp'].to_datetime}.to_h
      @daily_weight = tmp_weight.map {|k,v| [k, v.sum {|r| r['value']}]}.to_h
      # puts 'Daily Weight'
      # puts @daily_weight
    end

    # puts @response
  end

  def delete_event
    # url = "https://api.personicle.org/data/write/event/delete"?user_id=userid&event_id=some_event_id;another_event_id
    # RestClient::Request.execute(:url => url, headers: {Authorization: "Bearer #{session[:oktastate]['credentials']['token']} "}, :method => :delete, ),object_class: OpenStruct)
    # params[:select-all] = select-all_value
    events = params[:selected_events]

    if !events.nil?
      events = events.join(";")
      url = "https://api.personicle.org/data/write/event/delete?user_id=#{session[:oktastate]['uid']}&event_id=#{events}"
      res =  JSON.parse(RestClient::Request.execute(:url => url, headers: {Authorization: "Bearer #{session[:oktastate]['credentials']['token']} "}, :method => :delete,:verify_ssl => false ),object_class: OpenStruct)
      redirect_to pages_dashboard_path, refresh:"hard_refresh"
    end
  end

end