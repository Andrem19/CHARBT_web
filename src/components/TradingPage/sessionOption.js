import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { TIME_CONVERT } from '../../config';
import { useSelector } from 'react-redux';

export function SessionOption({ session, currentSessionId, handleDeleteClick, sessionsCount, currentSessionPnl }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isIconHovered, setIconHovered] = useState(false);
    const isMobile = useSelector(state => state.user.isMobile);
    const screenSize = useSelector(state => state.user.screenSize);
    const litleScreen = screenSize > 1020 && screenSize < 1536;

    const fontSize = isMobile ? 'small' : litleScreen ? '10px' : '16px';
    const balanceFontSize = isMobile ? 'small' : litleScreen ? '10px' : '16px';

    const coinPair = (currentPair) => {
        if (currentPair.length > 15) {
            return currentPair.substring(0, 15) + '...';
          } else {
            return currentPair;
          }
    }

    return (
        <div 
            style={{ display: 'flex', justifyContent: 'space-between', color: 'black' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div>
                <div style={{ fontWeight: session.id === currentSessionId ? 'bold' : 'normal', fontSize: balanceFontSize }}>
                    {litleScreen ? 'Bal' : 'Balance'}: {(session.balance + currentSessionPnl).toFixed(2)}
                </div>
                <div style={{ fontSize: fontSize }}>
                    {coinPair(session.coin_pair)}, {TIME_CONVERT[session.timeframe]}{`, ${session.pos_count || ''}`}
                </div>
                {litleScreen && <span style={{ fontSize: fontSize }}>{session.session_name}</span>}
            </div>
            {!litleScreen && <span style={{ fontSize: fontSize }}>{session.session_name}</span>}
            
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
