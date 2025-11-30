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

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expedientsNotes.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'deleteNote':
                echo json_encode(deleteNote($_POST));
            break;
            case 'updateNote':
                echo json_encode(updateNote($_POST));
            break;
            case 'createNote':
                echo json_encode(createNote($_POST));
            break;
            case 'seenNote':
                echo json_encode(seenNote($_POST));
            break;
        }
    }

    /**
     * Elimina una nota
     * 
     * @param array $note Nota
     * @return bool
     */
    function deleteNote($note){
        $expedientNotes = new ExpedientsNotes;
        return $expedientNotes->deleteNote($note);
    }

    /**
     * Modifica una nota
     * 
     * @param array $note Nota
     * @return bool
     */
    function updateNote($note){
        $expedientNotes = new ExpedientsNotes;

        $updated = $expedientNotes->updateNote($note);
        if(!$updated){
            return false;
        }

        // Assign to user notes
        $expedientNotes->deleteNoteUsers($note);

        $usersToSet = array();
        $users = $note['users'];
        foreach($users as $user){
            // Check if exist
            $exists = $expedientNotes->existsUser($user);
            if($exists){
                array_push($usersToSet, $exists);
            }
        }

        $usersToSet = array_unique($usersToSet);
        foreach($usersToSet as $elem){
            $data = array(
                'note' => $note['id'],
                'user' => $elem
            );
            $expedientNotes->createNoteUser($data);
        }

        return true;
    }

    /**
     * Crea una nota
     * 
     * @param array $note Nota
     * @return bool
     */
    function createNote($note){
        $expedientNotes = new ExpedientsNotes;

        $created = $expedientNotes->createNote($note);
        if(!$created){
            return false;
        }

        // Assign to user notes
        $usersToSet = array();
        $users = $note['users'];
        foreach($users as $user){
            // Check if exist
            $exists = $expedientNotes->existsUser($user);
            if($exists){
                array_push($usersToSet, $exists);
            }
        }

        $usersToSet = array_unique($usersToSet);
        foreach($usersToSet as $elem){
            $data = array(
                'note' => $created,
                'user' => $elem
            );
            $expedientNotes->createNoteUser($data);
        }

        return true;
    }

    /**
     * Ve una nota
     * 
     * @param array $note Nota
     * @return bool
     */
    function seenNote($note){
        $expedientNotes = new ExpedientsNotes;
        return $expedientNotes->seenNote($note);
    }
?>