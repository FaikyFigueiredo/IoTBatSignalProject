# See the build system documentation in IDF programming guide
# for more information about component CMakeLists.txt files.

idf_component_register(
    SRCS main.c apiWifi.c 													# list the source files of this component
    INCLUDE_DIRS        													# optional, add here public include directories
    PRIV_INCLUDE_DIRS   													# optional, add here private include directories
    REQUIRES nvs_flash esp_driver_gpio esp_netif esp_wifi espressif__mqtt	# optional, list the public requirements (component names)
    PRIV_REQUIRES       													# optional, list the private requirements
)
