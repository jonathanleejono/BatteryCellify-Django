from passlib.context import CryptContext
import statistics

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash(password: str):
    return pwd_context.hash(password)


def verify(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def search_query_battery_cell(query_param, attr: str, list: list):
    if query_param and query_param != "all":
        list = [obj for obj in list
                if getattr(obj, attr) == query_param]
    return list


def calc_float_avg(attr: str, list1: list):
    if list1 and len(list1) > 0:
        avg = statistics.fmean([getattr(obj, attr) for obj in list1])
        return round(avg, 2)
    else:
        return 0.0


def get_total_cells_by_value(attr: str, value, list: list):
    total = len([getattr(obj, attr)
                for obj in list if getattr(obj, attr) == value])
    return total


def get_list_total_cells_by_attr(attr: str, list: list):
    total = [getattr(obj, attr) for obj in list]
    return total


def get_cell_efficency(discharge_list: list, charge_list: list, condition: float):

    efficency = [float(a)/float(b)
                 for a, b in zip(discharge_list, charge_list) if a and b > condition]

    return efficency


def get_cycles_by_multiple_attr(attr1: str, list: list, attr2: str, attr3: str, condition):
    cycles_numbers_attr = [getattr(obj, attr1)
                           for obj in list if getattr(obj, attr2) and getattr(obj, attr3) > condition]
    return cycles_numbers_attr


def get_attr_by_cycles_step(attr: str, list: list, min_step: int, max_step: int):
    attr_cycles_step = [
        getattr(obj, attr) for obj in list if min_step <= obj.cycle_index <= max_step]
    return attr_cycles_step


""" 
the example below is for: get_avg_attr_by_another_attr_value

eg.     cycles_for_lco_cycles = [getattr(batteryCell, "cycles") for batteryCell in all_batteryCells 
        if getattr(batteryCell, "cathode") == "LCO"]

        avg_cycles_lco_cells = 0.0

        if len(cycles_for_lco_cycles) > 0:
            avg_cycles_lco_cells = statistics.fmean(cycles_for_lco_cycles)

        return avg_cycles_lco_cells

-> the function is using list comprehension to grab the "cycles" value for each 
battery cell in the entire list (all_batteryCells), if that same battery cell has 
a "cathode" value equal to "LCO". this creates a list of all the "cycles" values that meet
the criteria.

-> if the "cycles" list has more than 0 elements, then calculate the float average, else
leave the average value as 0.0

-> the getattr function grabs the value of an object based on the string attribute

-> the reason for using getattr is because the scalars().all() treats each batteryCell as an obj
and not as an individual dict, which is why keys are not being used to grab values

"""


def get_avg_attr_by_another_attr_value(attr1: str, attr2: str, valueForAttr2, list: list):
    totalattr = [getattr(obj, attr1)
                 for obj in list if getattr(obj, attr2) == valueForAttr2]

    avg_totalattr = 0.0

    if len(totalattr) > 0:
        avg_totalattr = statistics.fmean(totalattr)

    return round(avg_totalattr, 2)
