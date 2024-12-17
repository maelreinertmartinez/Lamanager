import React from 'react';

function ContextMenu({ contextMenu, handleDuplicate, handleEdit, handleMove, handleDelete }) {
    return (
        <div
            style={{
                position: 'fixed',
                top: contextMenu.mouseY,
                left: contextMenu.mouseX,
                backgroundColor: 'white',
                boxShadow: '0px 0px 5px rgba(0,0,0,0.5)',
                zIndex: 1000,
                cursor: 'pointer'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <ul style={{ listStyle: 'none', padding: '10px', margin: 0 }}>
                <li onClick={handleDuplicate}>Dupliquer</li>
                <li onClick={handleEdit}>Modifier</li>
                <li onClick={handleMove}>Déplacer</li>
                <li onClick={handleDelete}>Supprimer</li>
            </ul>
        </div>
    );
}

export default ContextMenu;
