<?php
// Copyright 2016 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

declare(strict_types=1);

namespace Anime\Services;

// Interface that must be implemented by a service manager logger.
interface ServiceLog {
    // Called when the service identified by |$identifier| has finished executing. The |$runtime|
    // indicates the time taken by the service's execution routine in milliseconds.
    public function onServiceExecuted(string $identifier, float $runtime);

    // Called when the service identified by |$identifier| has finished executing, but was not able
    // to run successfully. The |$runtime| indicates the time taken by the service in milliseconds.
    public function onServiceFailure(string $identifier, float $runtime);

    // Called when the service identified by |$identifier| failed to execute because |$exception|
    // got thrown. The |$runtime| indicates the time taken by the service in milliseconds.
    public function onServiceException(string $identifier, float $runtime, $exception);
}