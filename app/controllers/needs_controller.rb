class NeedsController < InheritedResources::Base
  before_action :authenticate_user!
  before_action :set_tags
  def new
    @need = Need.new
    @need.user_id = params[:user_id]
  end


  def edit
    @need = Need.find(params[:id])
  end

  def show
    @need = Need.find(params[:id])
  end

  def waitfor
    @need = Need.find(params[:id])
    @need.waitfor!
    respond_to do |format|
      format.html { redirect_to need_tasks_path(@need), notice: 'Need was successfully updated.' }
    end
  end

  def plan_confirm
    @need = Need.find(params[:id])
    @need.plan_confirm!
    respond_to do |format|
      format.html { redirect_to need_tasks_path(@need), notice: 'Need was successfully updated.' }
    end
  end

  def plan_refuse
    @need = Need.find(params[:id])
    @need.plan_refuse!
    respond_to do |format|
      format.html { redirect_to need_tasks_path(@need), notice: 'Need was successfully updated.' }
    end
  end

  def update
    @need = Need.find(params[:id])
     tags = params[:tags]
     tags = [] if tags.nil?
      
    respond_to do |format|
      @need.tag_list.each do |tag|
        @need.tag_list.remove(tag)
      end
      
      tags.each do |tag|
        @need.tag_list.add(tag)
      end
      @need.save
      @need.redo!

      if @need.update(need_params)
        format.html { redirect_to need_path(@need), notice: 'Product was successfully updated.' }
        format.json { render :show, status: :ok, location: @need }
      else
        format.html { render :edit }
        format.json { render json: @need.errors, status: :unprocessable_entity }
      end
    end
  end

  def create
    @need = Need.new(need_params)
    @need.user_id = current_user.id
    tags = params[:tags]
    tags = [] if tags.nil?

    respond_to do |format|
      if @need.save
        tags.each do |tag|
          @need.tag_list.add(tag)
        end
        @need.save
        
        format.html { redirect_to need_path(@need), notice: 'Product was successfully updated.'  }
        format.json { render :show, status: :created, location: @need }
      else
        format.html { render :new }
        format.json { render json: @need.errors, status: :unprocessable_entity }
      end
    end
  end

  private
  def set_tags
    @tags = YAML::load(File.read(Rails.root.to_s + '/config/project_tags.yml'))
  end

  def need_params
      params.require(:need).permit(:title, :avatar, 
        :client_name, :ref_price, :category, :main_media, 
        :description, :user_id, :start_date, 
        :ending_date, :final_date, :price_range)
  end
end
