import addRaw from "./add_raw"
import addApplication from "./add_application"
import addSupplier from "./add_supplier"
import addSupplierLinkedRaw from "./add_supplier_linked_raw"
import addSupplierLinkedApplication from "./add_supplier_linked_application"
import addUser from "./add_user"
import addUserLinkedRaw from "./add_user_linked_raw"
import addUserLinkedApplication from "./add_user_linked_application"
import follow from "./follow"
import followLinkedRaw from "./follow_linked_raw"
import followLinkedApplication from "./follow_linked_application"

export default (notification, index) => {
    switch (notification.type) {
        case "ADD_RAW":
            return addRaw(notification, index);
        case "ADD_APPLICATION":
            return addApplication(notification, index);
        case "ADD_SUPPLIER":
            return addSupplier(notification, index);
        case "ADD_SUPPLIER_LINKED_RAW":
            return addSupplierLinkedRaw(notification, index);
        case "ADD_SUPPLIER_LINKED_APPLICATION":
            return addSupplierLinkedApplication(notification, index);
        case "ADD_USER":
            return addUser(notification, index);
        case "ADD_USER_LINKED_RAW":
            return addUserLinkedRaw(notification, index);
        case "ADD_USER_LINKED_APPLICATION":
            return addUserLinkedApplication(notification, index);
        case "FOLLOW":
            return follow(notification, index);
        case "FOLLOW_LINKED_RAW":
            return followLinkedRaw(notification, index);
        case "FOLLOW_LINKED_APPLICATION":
            return followLinkedApplication(notification, index);
        default:
            return null;
    }
}