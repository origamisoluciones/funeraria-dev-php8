<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(!isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/security.php");

    if(isset($_POST)){
        if(isset($_POST['directory']) && isset($_POST['name']) && isset($_POST['type'])){
            $directory = cleanStr($_POST['directory']);
            if(preg_match('/\.\.\//', $directory)){
                echo json_encode(false);
                return;
            }
            $name = cleanStr($_POST['name']);
            if(preg_match('/\.\.\//', $name)){
                echo json_encode(false);
                return;
            }
            $type = cleanStr($_POST['type']);

            switch($type){
                case 'file':
                    echo json_encode(unlink($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory$name"));
                break;
                case 'folder':
                    function getDirContents($directory, $dir, &$results = array(), &$folders = array()){
                        $files = scandir($dir);

                        foreach($files as $key => $value){
                            $path = realpath($dir.DIRECTORY_SEPARATOR.$value);
                            if(!is_dir($path)){
                                $results[] = $path;
                            }else if($value != "." && $value != ".."){
                                $pathChange = explode(strtolower($directory), strtolower(str_replace("\\", "/", $path)));
                                getDirContents($directory, $path, $results, $folders);
                                $results[] = $path;
                                $folders[] = $pathChange;
                            }
                        }

                        return $folders;
                    }

                    $folders = getDirContents($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation", $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory");
                    $toDelete = array();
                    foreach($folders as $folder){
                        $dir = $folder[1];
                        $dir = explode('/', $dir);

                        $f = $dir[count($dir) - 1];
                        array_pop($dir);
                        $d = '';
                        foreach($dir as $elem){
                            $d .= $elem . '/';
                        }
                        
                        array_push($toDelete, array('dir' => $d, 'folder' => $f));
                    }

                    require_once($_SESSION['basePath'] . "model/documentation.php");
                    $documentation = new Documentation;
                    
                    foreach($toDelete as $elem){
                        $dir = $elem['dir'];
                        $folder = $elem['folder'];

                        $documentation->removePassword($dir, $folder);
                    }

                    $d = explode('/', $directory);
                    $folder = $d[count($d) - 1];
                    array_pop($d);
                    $dir = '';
                    foreach($d as $elem){
                        $dir .= $elem . '/';
                    }

                    $documentation->removePassword($dir, $folder);

                    exec("rm -rf " . $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory", $output, $status);
                    echo count($output) == 0 ? json_encode(true) : json_encode(false);
                break;
            }
        }else{
            echo json_encode(false);
        }
    }else{
        echo json_encode(false);
    }

    function recurseRmdir($dir){
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach($files as $file){
            (is_dir("$dir/$file")) ? recurseRmdir("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }
?>