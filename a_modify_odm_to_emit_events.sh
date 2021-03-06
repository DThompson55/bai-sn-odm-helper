#
# this modifies the ODM BAI emitter config to work with a local single node bai emitter
#

export ODM_install_folder=/Applications/IBM/ODM8103
export ODM_wlp_folder=~/Applications/wlp
export bai_install_folder=~/bai-single-node-19.0.3
export JAVA_HOME=$ODM_install_folder/jdk/Contents/Home
export ODM_plugin_config_folder=$(pwd)


echo 'set kafka port to 7777 in .env'
cd $bai_install_folder
cat .env | sed -e s/FLINK_UI_PORT.*/FLINK_UI_PORT=7777/ >modified.env
mv  .env backup.env
mv  modified.env .env

#
# We have to run --init before we can extract the password d'oh
#

grep FLINK_UI_PORT .env