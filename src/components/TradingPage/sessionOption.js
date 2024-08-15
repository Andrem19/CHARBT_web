import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { TIME_CONVERT } from '../../config';
import { useSelector } from 'react-redux';

export function SessionOption({ session, currentSessionId, handleDeleteClick, sessionsCount, currentSessionPnl }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isIconHovered, setIconHovered] = useState(false);
    const isMobile = useSelector(state => state.user.isMobile);

    const fontSize = isMobile ? 'small' : 'medium';
    const balanceFontSize = isMobile ? 'small' : 'large';

    return (
        <div 
            style={{ display: 'flex', justifyContent: 'space-between', color: 'black' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div>
                <div style={{ fontWeight: session.id === currentSessionId ? 'bold' : 'normal', fontSize: balanceFontSize }}>
                    Balance: {(session.balance + currentSessionPnl).toFixed(2)}
                </div>
                <div style={{ fontSize: fontSize }}>
                    {session.coin_pair}, {TIME_CONVERT[session.timeframe]}{`, ${session.pos_count || ''}`}
                </div>
            </div>
            <span style={{ fontSize: fontSize }}>{session.session_name}</span>
            {(isHovered || isMobile) && sessionsCount > 1 && 
                <FontAwesomeIcon 
                    icon={faTrash} 
                    onClick={(event) => handleDeleteClick(event, session.id)}
                    onMouseEnter={() => setIconHovered(true)}
                    onMouseLeave={() => setIconHovered(false)}
                    style={{ fontSize: isIconHovered ? '1.2em' : '1em', cursor: 'pointer' }}
                />
            }
        </div>
    );
}
