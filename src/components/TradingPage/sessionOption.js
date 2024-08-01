import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { TIME_CONVERT } from '../../config';

export function SessionOption({ session, currentSessionId, handleDeleteClick, sessionsCount, currentSessionPnl }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isIconHovered, setIconHovered] = useState(false);
    


    return (
        <div 
            style={{ display: 'flex', justifyContent: 'space-between', color: 'black' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div>
                <div style={{ fontWeight: session.id === currentSessionId ? 'bold' : 'normal' }}>
                    Balance: {(session.balance + currentSessionPnl).toFixed(2)}
                </div>
                <div style={{ fontSize: 'small' }}>
                    {session.coin_pair}, {TIME_CONVERT[session.timeframe]}{`, ${session.pos_count | ''}`}
                </div>
            </div>
            <span>{session.session_name}</span>
            {isHovered && sessionsCount > 1 && 
                <FontAwesomeIcon 
                icon={faTrash} 
                onClick={(event) => handleDeleteClick(event, session.id)}
                onMouseEnter={() => setIconHovered(true)}
                onMouseLeave={() => setIconHovered(false)}
                style={{ fontSize: isIconHovered ? '1.5em' : '1em', cursor: 'pointer' }}
                 />
            }
        </div>
    );
}