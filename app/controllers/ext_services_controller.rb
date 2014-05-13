=begin

== Popis
Vzhľadomna to, že editačné prostredie aj režim zobrazovania web stránky má AJAX-ový charakter obsahuje tento controller potrebné API akcie.
Tieto akcie sú volané pomocou AJAX-ových volaní z editačného alebo zobrazovacieho režimu.
V každom kroku priebehu vykonávania každej akcie sa overujú hodnoty parametrov od používateľa.

== Ukážka výpisu odpovede na akciu
Úspešný priebeh akcie
 render :json => { 'update_settings_result' => "1", 'ext_service_value' => service.service_value}.to_json

Neúspešný priebeh akcie
 render :json => { :errors => ext_service.errors.full_messages }.to_json

=end
class ExtServicesController < ApplicationController

  #Akcia pre vytvorenie záznamu externej služby.
  def create_ext_service
    if check_id(params[:web_id])
      web = Web.find_by_id(params[:web_id])
      unless web.nil?
        ext_service = web.ext_services.new()
        ext_service.service_type = params[:service_type]
        ext_service.service_value = params[:service_value]
        if ext_service.save
          render :json => { 'create_result' => "1", 'ext_service_id' => ext_service.id, 'ext_service_type' => ext_service.service_type, 'ext_service_value' => ext_service.service_value}.to_json
        else
          render :json => { :errors => ext_service.errors.full_messages }.to_json
        end
      else
        output = "Web doesn't exist."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad id of web."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #Akcia pre úpravu služby tretej strany.
  def update_ext_service
    if  check_id(params[:web_id])
      if check_id(params[:service_id])
        web = Web.find_by_id(params[:web_id])
        unless web.nil?
          service = web.ext_services.find_by_id(params[:service_id])
          unless service.nil?
            service.service_value = params[:service][:value]
            if service.save
              render :json => { 'update_settings_result' => "1", 'ext_service_value' => service.service_value}.to_json
            else
              render :json => { :errors => service.errors.full_messages }.to_json
            end
          else
            output = "Service doesn't exist."
            render :json => { 'errors' => [output]}.to_json
          end
        else
          output = "Web external service doesn't exist."
          render :json => { 'errors' => [output]}.to_json
        end
      else
        output = "Bad id of service."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad id of web."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  #Akcia pre vymazanie externej služby.
  def delete_ext_service
    if check_id(params[:service_id])
      service = ExtService.find_by_id(params[:service_id])
      unless service.nil?
        if service.destroy
          render :json => { 'delete_result' => "1"}.to_json
        else
          output = "Cannot delete service."
          render :json => { 'errors' => [output]}.to_json
        end
      else
        output = "Service doesn't exist."
        render :json => { 'errors' => [output]}.to_json
      end
    else
      output = "Bad id of service."
      render :json => { 'errors' => [output]}.to_json
    end
  end

  private
    def check_id(string)
      Integer(string) != nil rescue false
    end

end