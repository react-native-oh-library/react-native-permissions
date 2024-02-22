# the minimum version of CMake
cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

file(GLOB rnoh_permissions_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_permissions SHARED ${rnoh_permissions_SRC})
target_include_directories(rnoh_permissions PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(rnoh_permissions PUBLIC rnoh)
