#
# this modifies the ODM BAI emitter config to work with a local single node bai emitter
#

export ODM_install_folder=/Applications/IBM/ODM8103
export ODM_wlp_folder=/Users/dtt/Applications/wlp
export bai_install_folder=/Users/dtt/bai-single-node-19.0.3
export kafka_truststore_password=$(cat $bai_install_folder/certs/kafka/store-password.txt)
export JAVA_HOME=$ODM_install_folder/jdk/Contents/Home
export ODM_plugin_config_folder=$(pwd)


echo 'modifying ODM Decision Server with ODM config file'
cd $ODM_install_folder
./shared/tools/ant/bin/ant \
-f executionserver/bin/ressetup.xml \
-Dbai.war.in=executionserver/applicationservers/WLP/DecisionService.war \
-Dbai.war.out=$ODM_wlp_folder/usr/servers/odm81030/apps/DecisionService.war \
-Dbai.enable=true \
-Dbai.properties=$ODM_plugin_config_folder/modified-plugin-configuration.properties \
setup-bai



