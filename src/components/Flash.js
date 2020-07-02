import React, { useEffect, useState } from "react";

import "./index.css";

export const Flash = () => {
  let [visibility, setVisibility] = useState(false);
  let [message, setMessage] = useState("");
  let [type, setType] = useState("");

  return (
    visibility && (
      <div className={`alert alert-${type}`}>
        <span className="close">
          <strong>X</strong>
        </span>
        <p>{message}</p>
      </div>
    )
  );
};
<Flash />;


.alert {
  color: white;
  border-radius: 10px;
  position: absolute;
  top: 50px;
  right: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  z-index: 1111;
  }
  .alert p {
  margin: 0;
  }
  .alert-error {
  background: lightcoral;
  }
  .alert-success {
  background: lightgreen;
  }
  .close {
  color: white;
  cursor: pointer;
  margin-right: 10px;
  }


  import React, { useEffect, useState } from 'react';
import Bus from '../Utils/Bus';

import './index.css';

export const Flash = () => {
    let [visibility, setVisibility] = useState(false);
    let [message, setMessage] = useState('');
    let [type, setType] = useState('');

    useEffect(() => {
        Bus.addListener('flash', ({message, type}) => {
            setVisibility(true);
            setMessage(message);
            setType(type);
            setTimeout(() => {
                setVisibility(false);
            }, 4000);
        });
                

    }, []);

    useEffect(() => {
        if(document.querySelector('.close') !== null) {
            document.
            querySelector('.close').
            addEventListener('click', () => setVisibility(false));
        }
    })

    return (
        visibility && <div className={`alert alert-${type}`}>
                <span className="close"><strong>X</strong></span>
                <p>{message}</p>
            </div>
    )
}