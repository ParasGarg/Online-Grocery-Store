// function that will convert case and omits invalid characters
module.exports = {

	emailToLowerCase: (email) => {			// convert upper case to lower case
		let len = email.length;
		let convertedEmail = "";

		if (len != 0) {
			for (var i = 0; i < len; i++) {
				let charCode = email.charCodeAt(i);

				if (charCode >= 65 && charCode <= 90) {								// checking for upper case alphabets 
					charCode += 32;
					convertedEmail += String.fromCharCode(charCode);
				} else if ((charCode >= 97 && charCode <= 122) ||                   // checking for lower case alphabets
							(charCode >= 48 && charCode <= 57) ||                   // checking for numbers
							charCode == 46 || charCode == 64 || charCode == 95) {   // checking for allowed special characters
					convertedEmail += email.charAt(i);
				}
			}
		}

		return convertedEmail;
	}
}