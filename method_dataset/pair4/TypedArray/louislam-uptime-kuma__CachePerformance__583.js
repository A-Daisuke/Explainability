        function CachePerformance() {
            /**
             * Tracks the hit rate for the last 100 requests. If there
             * have been fewer than 100 requests, the hit rate just
             * considers the requests that have happened.
             */
            this.hitsLast100 = new Uint8Array(100 / 4); // each hit is 2 bits

            /**
             * Tracks the hit rate for the last 1000 requests. If there
             * have been fewer than 1000 requests, the hit rate just
             * considers the requests that have happened.
             */
            this.hitsLast1000 = new Uint8Array(1000 / 4); // each hit is 2 bits

            /**
             * Tracks the hit rate for the last 10000 requests. If there
             * have been fewer than 10000 requests, the hit rate just
             * considers the requests that have happened.
             */
            this.hitsLast10000 = new Uint8Array(10000 / 4); // each hit is 2 bits

            /**
             * Tracks the hit rate for the last 100000 requests. If
             * there have been fewer than 100000 requests, the hit rate
             * just considers the requests that have happened.
             */
            this.hitsLast100000 = new Uint8Array(100000 / 4); // each hit is 2 bits

            /**
             * The number of calls that have passed through the
             * middleware since the server started.
             */
            this.callCount = 0;

            /**
             * The total number of hits since the server started
             */
            this.hitCount = 0;

            /**
             * The key from the last cache hit.  This is useful in
             * identifying which route these statistics apply to.
             */
            this.lastCacheHit = null;

            /**
             * The key from the last cache miss.  This is useful in
             * identifying which route these statistics apply to.
             */
            this.lastCacheMiss = null;

            /**
             * Return performance statistics
             * @returns {Object}
             */
            this.report = function () {
                return {
                    lastCacheHit: this.lastCacheHit,
                    lastCacheMiss: this.lastCacheMiss,
                    callCount: this.callCount,
                    hitCount: this.hitCount,
                    missCount: this.callCount - this.hitCount,
                    hitRate: this.callCount == 0 ? null : this.hitCount / this.callCount,
                    hitRateLast100: this.hitRate(this.hitsLast100),
                    hitRateLast1000: this.hitRate(this.hitsLast1000),
                    hitRateLast10000: this.hitRate(this.hitsLast10000),
                    hitRateLast100000: this.hitRate(this.hitsLast100000),
                };
            };

            /**
             * Computes a cache hit rate from an array of hits and
             * misses.
             * @param {Uint8Array} array An array representing hits and
             * misses.
             * @returns {?number} a number between 0 and 1, or null if
             * the array has no hits or misses
             */
            this.hitRate = function (array) {
                let hits = 0;
                let misses = 0;
                for (let i = 0; i < array.length; i++) {
                    let n8 = array[i];
                    for (let j = 0; j < 4; j++) {
                        switch (n8 & 3) {
                            case 1:
                                hits++;
                                break;
                            case 2:
                                misses++;
                                break;
                        }
                        n8 >>= 2;
                    }
                }
                let total = hits + misses;
                if (total == 0) {
                    return null;
                }
                return hits / total;
            };

            /**
             * Record a hit or miss in the given array.  It will be
             * recorded at a position determined by the current value of
             * the callCount variable.
             * @param {Uint8Array} array An array representing hits and
             * misses.
             * @param {boolean} hit true for a hit, false for a miss
             * Each element in the array is 8 bits, and encodes 4
             * hit/miss records. Each hit or miss is encoded as to bits
             * as follows: 00 means no hit or miss has been recorded in
             * these bits 01 encodes a hit 10 encodes a miss
             */
            this.recordHitInArray = function (array, hit) {
                let arrayIndex = ~~(this.callCount / 4) % array.length;
                let bitOffset = (this.callCount % 4) * 2; // 2 bits per record, 4 records per uint8 array element
                let clearMask = ~(3 << bitOffset);
                let record = (hit ? 1 : 2) << bitOffset;
                array[arrayIndex] = (array[arrayIndex] & clearMask) | record;
            };

            /**
             * Records the hit or miss in the tracking arrays and
             * increments the call count.
             * @param {boolean} hit true records a hit, false records a
             * miss
             */
            this.recordHit = function (hit) {
                this.recordHitInArray(this.hitsLast100, hit);
                this.recordHitInArray(this.hitsLast1000, hit);
                this.recordHitInArray(this.hitsLast10000, hit);
                this.recordHitInArray(this.hitsLast100000, hit);
                if (hit) {
                    this.hitCount++;
                }
                this.callCount++;
            };

            /**
             * Records a hit event, setting lastCacheMiss to the given key
             * @param {string} key The key that had the cache hit
             */
            this.hit = function (key) {
                this.recordHit(true);
                this.lastCacheHit = key;
            };

            /**
             * Records a miss event, setting lastCacheMiss to the given key
             * @param {string} key The key that had the cache miss
             */
            this.miss = function (key) {
                this.recordHit(false);
                this.lastCacheMiss = key;
            };
        }
