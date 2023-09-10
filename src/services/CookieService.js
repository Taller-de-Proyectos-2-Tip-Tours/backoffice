import Cookies from "js-cookie";

export default class CookieService {
	static get(name) {
		return Cookies.get(name);
	}

	static set(name, value) {
		return Cookies.set(name, value);
	}

	static delete(name) {
		return Cookies.remove(name, "");
	}

	static isLogIn() {
		const token = this.get('token');
		if(token){
			return true
		}
		return false
	}
}