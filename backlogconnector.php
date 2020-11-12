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
				localStorage.setItem(storageKey, JSON.stringify(data));
			}
			
			this.remove = function(){
				localStorage.removeItem(storageKey);
			}
		}
		
		<?php foreach($_POST as $key => $value){ ?>
			<?php echo $key. ":" .$value. "<BR/>"; ?>
		<?php }?>
	</script>
	<body></body>
</html>
