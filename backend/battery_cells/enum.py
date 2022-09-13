from django.db import models


class BatteryCellEnum:
    class Cathode(models.TextChoices):
        LCO = "LCO"
        LFP = "LFP"
        NCA = "NCA"
        NMC = "NMC"
        NMC_LCO = "NMC-LCO"

    class Anode(models.TextChoices):
        GRAPHITE = "graphite"

    class Type(models.TextChoices):
        TYPE_18650 = "18650"
        POUCH = "pouch"
        PRISMATIC = "prismatic"

    class Source(models.TextChoices):
        HNEI = "HNEI"
        UL_PUR = "UL-PUR"
        CALCE = "calce"
        OXFORD = "oxford"
        SNL = "snl"
