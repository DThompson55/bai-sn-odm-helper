#
# this modifies the ODM BAI emitter config to work with a local single node bai emitter
#

export ODM_install_folder=/Applications/IBM/ODM8103
export ODM_wlp_folder=/Users/dtt/Applications/wlp
export bai_install_folder=/Users/dtt/bai-single-node-19.0.3
export kafka_truststore_password=$(cat $bai_install_folder/certs/kafka/store-password.txt)
export JAVA_HOME=$ODM_install_folder/jdk/Contents/Home
export ODM_plugin_config_folder=$(pwd)


#
# We have to run --init before we can extract the password d'oh
#

echo 'inserting kafka truststore secret into ODM config file'
cat plugin-configuration.properties | sed -e s/com.ibm.rules.bai.plugin.kafka.ssl.truststore.password.*/com.ibm.rules.bai.plugin.kafka.ssl.truststore.password=$kafka_truststore_password/ >modified-plugin-configuration.properties
# some other time-e s/com.ibm.rules.bai.plugin.kafka.ssl.truststore.location.*/com.ibm.rules.bai.plugin.kafka.ssl.truststore.location=$bai_install_folder/certs/kafka/truststore.jks/ 
grep truststore modified-plugin-configuration.properties

echo 'modifying ODM Decision Server with ODM config file'
cd $ODM_install_folder
./shared/tools/ant/bin/ant \
-f executionserver/bin/ressetup.xml \
-Dbai.war.in=executionserver/applicationservers/WLP/DecisionService.war \
-Dbai.war.out=$ODM_wlp_folder/usr/servers/odm81030/apps/DecisionService.war \
-Dbai.enable=true \
-Dbai.properties=$ODM_plugin_config_folder/modified-plugin-configuration.properties \
setup-bai

echo 'be sure to restart ODM'
