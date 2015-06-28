# clear
sudo docker rm -f remem_app

sudo docker rm -f remem_db
sudo docker rm -f remem_db_data

sudo docker rmi -f remem_image

# mongo
sudo docker run --name remem_db_data mongo echo "Data-only container for mongo"
sudo docker run -d --volumes-from remem_db_data --name remem_db mongo

# meteor and app
sudo docker build -t remem_image .
sudo docker run -d --name remem_app --link remem_db -e ROOT_URL=http://0.0.0.0 -e MONGO_URL=mongodb://remem_db:27017/meteor -p 80:80 remem_image
