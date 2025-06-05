from enum import Enum

class TimePeriod(Enum):
    LAST_24H = "24h"
    LAST_48H = "48h"
    LAST_WEEK = "week"
    LAST_MONTH = "month"
    YEAR_2023 = "2023"
    YEAR_2022 = "2022"
    YEAR_2021 = "2021"

class ReportPeriod(str, Enum):
    LAST_24H = "24h"
    LAST_48H = "48h"
    LAST_WEEK = "week"
    LAST_MONTH = "month"

class ReportDetail(str, Enum):
    BASIC = "basic"
    DETAILED = "detailed"
    ANALYTICAL = "analytical"
