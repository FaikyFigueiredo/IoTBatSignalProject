//PUBLISHER
#include <stdio.h>
#include <stdbool.h>
#include <unistd.h>
#include "apiWifi.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/gpio.h"
#include "hal/gpio_types.h"
#include "mqtt_client.h"
#include "portmacro.h"

static QueueHandle_t gpio_evt_queue = NULL;
static esp_mqtt_client_handle_t client = NULL;

static void IRAM_ATTR gpio_isr_handler(void* arg) {
    uint32_t gpio_num = (uint32_t) arg;
    xQueueSendFromISR(gpio_evt_queue, &gpio_num, NULL);
}


static void mqttHandler(void* args, esp_event_base_t base, int32_t eventId, void* data) {

    switch ((esp_mqtt_event_id_t)eventId) {
        case MQTT_EVENT_CONNECTED:
			ESP_LOGI("MQTT", "CONNECTED!!!!");
			break;
        case MQTT_EVENT_DISCONNECTED:
            ESP_LOGI("MQTT", "ERROR, Coringa quebrou a rede");
		default:
    }
}

void batSignalHandler(void* arg){
	char* msg;
	uint32_t io_num;
	
	while(1){
		if(xQueueReceive(gpio_evt_queue, &io_num, portMAX_DELAY)){

			esp_mqtt_client_publish(client, "gotham/dpgc/batimados/batsignal", "BATSIGNAL_TOGGLE", 0, 1, 0);
		}
	}
}

void app_main(void) {
    ESP_ERROR_CHECK(apiWifi_init());
    ESP_ERROR_CHECK(apiWifi_connect("brisa-1950751", "Fabinho13"));

    gpio_config_t io_conf = {
        .pin_bit_mask = 0b1 << 4,
        .mode = GPIO_MODE_INPUT,
        .pull_up_en = GPIO_PULLUP_ENABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_NEGEDGE
    };
    gpio_config(&io_conf);

    gpio_install_isr_service(0);

    gpio_isr_handler_add(4, gpio_isr_handler, (void*) 4);

    esp_mqtt_client_config_t mqtt_cfg = {
        .broker.address.uri = "mqtt://192.168.0.6:1883",
    };

    client = esp_mqtt_client_init(&mqtt_cfg);
	gpio_evt_queue = xQueueCreate(10, sizeof(uint32_t));
    xTaskCreate(batSignalHandler, "batSignal", 2048, (void*)client, 10, NULL);
    esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqttHandler, NULL);
    esp_mqtt_client_start(client);

}





//SUBSCRIBER

#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <unistd.h>
#include "apiWifi.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "driver/gpio.h"
#include "mqtt_client.h"

static uint8_t batStatus = 0;

//Função que liga e apaga o LED
void batSignalHandler(void* arg){ //void* endereço de memória cru
	ESP_LOGI("MQTT", "TOGGLING PIN"); //Log do sistema: envia mensagem pro terminal da IDE
	if(batStatus) gpio_set_level(6,0); //Compara Strings e converte de void* para char*
	else gpio_set_level(6, 0);
    batStatus = 1 - batStatus;
}

static void mqttHandler(void* args, esp_event_base_t base, int32_t eventId, void* data) {
    esp_mqtt_event_handle_t event = data; //Estrutura do evento MQTT
    esp_mqtt_client_handle_t client = event->client; //Estrutura do cliente (Interface pra usar o MQTT)

    switch ((esp_mqtt_event_id_t)eventId) { //Tipo status HTTP
        case MQTT_EVENT_CONNECTED: //MQTT_EVENT representa um número
			ESP_LOGI("MQTT", "CONNNECTED TO MQTT");// Log do ESP: Printa na IDE
			esp_mqtt_client_subscribe(client, "gotham/dpgc/batimados/batsignal", 1);// Se inscreve no tópico
			break;
        case MQTT_EVENT_DISCONNECTED:
            ESP_LOGI("MQTT", "ERROR, Coringa quebrou a rede");// Log do ESP: Printa na IDE
            break;
        case MQTT_EVENT_DATA:
			batSignalHandler(event->data);//Função vista anteriormente (batSignalHandler)
            if(batStatus)
                esp_mqtt_client_publish(client, "gotham/dpgc/batimados/batstatus", "BATSIGNAL_ON", 0, 1, 0);
            else
                esp_mqtt_client_publish(client, "gotham/dpgc/batimados/batstatus", "BATSIGNAL_OFF", 0, 1, 0);
			ESP_LOGI("MQTT", "DATA RECEIVED");// Log do ESP: Printa na IDE
		default:
    }
}

void app_main(void) {
    ESP_ERROR_CHECK(apiWifi_init()); //Inicializa o Wifi
    ESP_ERROR_CHECK(apiWifi_connect("brisa-1950751", "Fabinho13")); //Se conecta com Wifi
	
	//Configuração do pino do LED:
	gpio_reset_pin(6);// Reseta o pino 6
	gpio_set_direction(6, GPIO_MODE_OUTPUT); // Seta ele pra ser saída
	
    esp_mqtt_client_config_t mqtt_cfg = {//Configuração do MQTT
        .broker.address.uri = "mqtt://192.168.0.6:1883" //Endereço de IP do broker (porta padrão do broker é 1883)
    };

    esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg); // Inicializa o broker (representação do broker no ESP)
    esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqttHandler, NULL); // Define a função que lida com os eventos
    esp_mqtt_client_start(client);// Conecta com o broker!!

}

