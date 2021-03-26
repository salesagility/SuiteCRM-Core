<?php

namespace App\Statistics\Model;

class ChartOptions
{
    /**@var int|null height */
    public $height;

    /**@var string|null $scheme */
    public $scheme;

    /**@var bool|null $gradient */
    public $gradient;

    /**@var bool|null $xAxis */
    public $xAxis;

    /**@var bool|null $yAxis */
    public $yAxis;

    /**@var bool|null $legend */
    public $legend;

    /**@var bool|null $showXAxisLabel */
    public $showXAxisLabel;

    /**@var bool|null $gradient */
    public $showYAxisLabel;

    /**@var string|null $xAxisLabel */
    public $xAxisLabel;

    /**@var string|null $yAxisLabel */
    public $yAxisLabel;

    /**@var string|null $xScaleMin */
    public $xScaleMin;

    /**@var string|null $xScaleMax */
    public $xScaleMax;

    /**@var string[]|null $xAxisTicks */
    public $xAxisTicks;

    /**@var bool|null $yAxisTickFormatting */
    public $yAxisTickFormatting;

    /**@var bool|null $xAxisTickFormatting */
    public $xAxisTickFormatting;

    /**@var bool|null $tooltipDisabled */
    public $tooltipDisabled;
}
