npm run build
echo "Enter commit message: "
git add .
read message
git commit -m "$message"
git push origin main
