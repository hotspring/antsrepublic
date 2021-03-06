class WelcomeController < ApplicationController
  def index
    # @products = QueenWork.order(:updated_at => :desc).limit(12)
    @q = QueenWork.ransack(category_eq: params[:category])
    @products = @q.result.limit(12).order(:updated_at => :desc)
    # @products = @q.result.limit(12).order(:updated_at => :desc).sort_by { |p| - p.followers_count }

    if Queen.where('sort_no > 0').count > 0
    	@queens = Queen.where('sort_no > 0').order(:sort_no => :desc)
    else
    	@queens = Queen.order(:sort_no => :desc).limit(16)
    end

    @ant_point = AntPoint.first
    if @ant_point
    	@ant_point.total_amounts ||= 0
    	@ant_point.total_projects ||= 0
    	@ant_point.total_ants ||= 0


    	@ant_point.total_ants += rand(0..2) if rand(10)>8

    	@ant_point.save
    else
    	@ant_point = AntPoint.create!
    	@ant_point.total_amounts = 0
    	@ant_point.total_projects = 0
    	@ant_point.total_ants = 0
    	@ant_point.save
    end
  end


end
