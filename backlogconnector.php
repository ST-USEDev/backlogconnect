<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="jquery-3.5.1.js"></script>
		<meta charset="UTF-8">
	</head>
	<script type="text/javascript">
	
		function Storage(){
			const storageKey = "backlogConnectionInfo";
			
			this.get = function(){
				const data = localStorage.getItem(storageKey);
				if(!data){
					return null;
				}
				return JSON.parse(data);
			}
			
			this.set = function(data){
				if(data){
					localStorage.setItem(storageKey, JSON.stringify(data));
				}
			}
			
			this.remove = function(){
				localStorage.removeItem(storageKey);
			}
		}
		
		const storage = new Storage();
		const data = {};
		let dataAdd = false;
		
		<?php foreach($_POST as $key => $value){ ?>
			dataAdd = true;
			data["<?php echo $key; ?>"] = "<?php echo $value; ?>";
		<?php }?>
		
		if(dataAdd){
			storage.set(data);
		}
		
		console.log(storage.get());
	</script>
	<body></body>
</html>
