import { useRef, useEffect } from 'react';

import jwt_decode from "jwt-decode";

export const checkEmailValid = (email) => {
    if (typeof email === "undefined") {
        return false;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
    }
    return false
}

export const checkPermission = (token, code) => {
    const jwtDecoded = jwt_decode(token);
    //console.log(jwtDecoded);
    let result = false;

    if (jwtDecoded.hasOwnProperty("scopes")) {
        if (jwtDecoded["scopes"].indexOf("SUPERADMIN") > -1) return true;
        return jwtDecoded["scopes"].findIndex(o => o.match(code)) > -1;
    }

    return result;
}

export const addOrRemoveItem = (arr, value) => {

    const index = arr.indexOf(value);

    const temp = [...arr];

    if (index < 0) {
        temp.push(value);
    } else {
        temp.splice(index, 1);
    }

    return temp;
}

export const downloadFile = (response, fileName) => {

    const href = window.URL.createObjectURL(response.data);

    const anchorElement = document.createElement('a');

    anchorElement.href = href;

    // Get the value of content-disposition header
    const contentDisposition = response.headers['Content-Disposition'];

    // if the header is set, extract the filename
    //console.log(contentDisposition);
    if (contentDisposition) {
        const fileNameMatch =
            contentDisposition.match(/filename="(.+)"/);

        if (fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
        }
    }

    anchorElement.download = fileName;

    document.body.appendChild(anchorElement);
    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
}

export const countRemainSpace = (parkingSpaceIsSpecial, remainSpace, enabledSpecialSpace) => {
    let count = remainSpace;
    if (parkingSpaceIsSpecial === 0) count = remainSpace - enabledSpecialSpace;

    return count;
}

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export const statusColors = [
    {
        status: -1,
        color: "#CCCCD4",
    }, {
        status: 0,
        color: "#00E6DC",
    }, {
        status: 1,
        color: "#FAA0A0"
    }
]